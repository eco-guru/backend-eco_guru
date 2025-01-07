import { validate } from "../validation/validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { dashboardSchema } from "../validation/dashboard-validation.js";

// Helper function to safely convert BigInt to Number
const bigIntToNumber = (value) => {
  if (typeof value === 'bigint') {
    return Number(value);
  }
  return value;
};

// Helper function to process database results and convert BigInts
const processBigIntResults = (data) => {
  if (Array.isArray(data)) {
    return data.map(item => {
      const processedItem = {};
      for (const [key, value] of Object.entries(item)) {
        processedItem[key] = bigIntToNumber(value);
      }
      return processedItem;
    });
  }
  return data;
};

const calculateTotalSavings = async (startDate, endDate) => {
  const result = await prismaClient.transactions.aggregate({
    _sum: {
      total: true
    },
    where: {
      transaction_date: {
        gte: startDate,
        lte: endDate
      }
    }
  });
  return bigIntToNumber(result._sum.total) || 0;
};

const calculateTotalWaste = async (startDate, endDate) => {
  const result = await prismaClient.transactionData.aggregate({
    _sum: {
      quantity: true
    },
    where: {
      Transactions: {
        transaction_date: {
          gte: startDate,
          lte: endDate
        }
      }
    }
  });
  return bigIntToNumber(result._sum.quantity) || 0;
};

const getTotalUsers = async () => {
  const count = await prismaClient.users.count();
  return bigIntToNumber(count);
};

const getTotalTransactions = async (startDate, endDate) => {
  const count = await prismaClient.transactions.count({
    where: {
      transaction_date: {
        gte: startDate,
        lte: endDate
      }
    }
  });
  return bigIntToNumber(count);
};

const getMonthlyWaste = async (startDate, endDate) => {
  const monthlyData = await prismaClient.$queryRaw`
    SELECT 
      EXTRACT(MONTH FROM t.transaction_date) as month,
      SUM(td.quantity) as total_quantity
    FROM "Transactions" t
    JOIN "TransactionData" td ON t.id = td.transaction_id
    WHERE t.transaction_date BETWEEN ${startDate} AND ${endDate}
    GROUP BY EXTRACT(MONTH FROM t.transaction_date)
    ORDER BY month
  `;

  return processBigIntResults(monthlyData);
};

const getWasteTypesByMonth = async (startDate, endDate) => {
  const wasteTypes = await prismaClient.$queryRaw`
    SELECT 
      EXTRACT(MONTH FROM t.transaction_date) as month,
      wt.type as waste_type,
      SUM(td.quantity) as total_quantity
    FROM "Transactions" t
    JOIN "TransactionData" td ON t.id = td.transaction_id
    JOIN "WasteType" wt ON td.waste_type_id = wt.id
    WHERE t.transaction_date BETWEEN ${startDate} AND ${endDate}
    GROUP BY EXTRACT(MONTH FROM t.transaction_date), wt.type
    ORDER BY month, total_quantity DESC
    LIMIT 4
  `;

  return processBigIntResults(wasteTypes);
};

const getTopWasteTypes = async (startDate, endDate) => {
  const topWasteTypes = await prismaClient.$queryRaw`
    SELECT 
      wt.type as waste_type,
      SUM(td.quantity) as total_quantity
    FROM "TransactionData" td
    JOIN "WasteType" wt ON td.waste_type_id = wt.id
    JOIN "Transactions" t ON td.transaction_id = t.id
    WHERE t.transaction_date BETWEEN ${startDate} AND ${endDate}
    GROUP BY wt.type
    ORDER BY total_quantity DESC
    LIMIT 4
  `;

  return processBigIntResults(topWasteTypes);
};

const getRecentTransactions = async () => {
  const transactions = await prismaClient.transactions.findMany({
    take: 5,
    orderBy: {
      transaction_date: 'desc'
    },
    include: {
      Users: {
        select: {
          username: true
        }
      },
      TransactionData: {
        include: {
          WasteType: true,
          UOM: true
        }
      }
    }
  });

  return transactions.map(transaction => ({
    ...transaction,
    total: bigIntToNumber(transaction.total),
    TransactionData: transaction.TransactionData.map(data => ({
      ...data,
      quantity: bigIntToNumber(data.quantity)
    }))
  }));
};

const getDashboardData = async (
  startDate = new Date(new Date().getFullYear(), 0, 1),
  endDate = new Date()
) => {
  const request = validate(dashboardSchema, { startDate, endDate });
  try {
    const [
      totalSavings,
      totalWaste,
      totalUsers,
      totalTransactions,
      monthlyWaste,
      wasteTypesByMonth,
      topWasteTypes,
      recentTransactions
    ] = await Promise.all([
      calculateTotalSavings(request.startDate, request.endDate),
      calculateTotalWaste(request.startDate, request.endDate),
      getTotalUsers(),
      getTotalTransactions(request.startDate, request.endDate),
      getMonthlyWaste(request.startDate, request.endDate),
      getWasteTypesByMonth(request.startDate, request.endDate),
      getTopWasteTypes(request.startDate, request.endDate),
      getRecentTransactions()
    ]);

    return {
      total_tabungan: totalSavings,
      total_sampah_terkumpul: totalWaste,
      total_nasabah: totalUsers,
      total_transaksi: totalTransactions,
      jumlah_sampah_bulanan: monthlyWaste,
      jenis_sampah_per_bulan: wasteTypesByMonth,
      jenis_sampah_terbanyak: topWasteTypes,
      transaksi_terkini: recentTransactions
    };
  } catch (error) {
    throw new ResponseError(500, `Error getting dashboard data: ${error.message}`);
  }
};

const getTotalArticleViews = async (startDate, endDate) => {
  const result = await prismaClient.logArticles.count({});
  return bigIntToNumber(result) || 0;
}

const getTotalArticle = async () => {
  const result = await prismaClient.articles.count({});
  return bigIntToNumber(result) || 0;
}

const getTotalVideoViews = async (startDate, endDate) => {
  const result = await prismaClient.logVideos.count({});
  return bigIntToNumber(result) || 0;
}

const getTotalVideos = async () => {
  const result = await prismaClient.videos.count({});
  return bigIntToNumber(result) || 0;
}

const getPopularVideo = async () => {
  const result = await prismaClient.videos.findMany({
    select: {
      thumbnail_url: true,
      title: true,
      _count: {
        select: {
          LogVideos: true
        }
      }
    }
  });
  
  const data = result.sort((a, b) => b._count.LogVideos - a._count.LogVideos)[0];

  return {
    title: data.title,
    thumbnail_url: data.thumbnail_url,
    views: data._count.LogVideos
  };
}

const getPopularArticle = async () => {
  const result = await prismaClient.articles.findMany({
    select: {
      thumbnail_url: true,
      title: true, 
      _count: {
        select: {
          LogArticles: true
        }
      }
    }
  });
  
  const data = result.sort((a, b) => b._count.LogArticles - a._count.LogArticles)[0];

  return {
    title: data.title,
    thumbnail_url: data.thumbnail_url,
    views: data._count.LogArticles
  };
}

const getFluctuationContent = async () => {

  const articles = await prismaClient.articles.findMany({
    select: {
      created_date: true,
      _count: {
        select: {
          LogArticles: true
        }
      }
    }
  });

  const videos = await prismaClient.videos.findMany({
    select: {
      upload_date: true,
      _count: {
        select: {
          LogVideos: true
        }
      }
    }
  });

  const data = [
    ...articles.map(value => ({
      created_date: value.created_date,
      views: value._count.LogArticles
    })), 
    ...videos.map(value => ({
      created_date: value.upload_date,
      views: value._count.LogVideos
    }))
  ];

  const result = data.reduce((result, item) => {
    const month = item.created_date.toISOString().slice(0, 7);
    result[month] = result[month] || { views: 0 };
    result[month].views += item.views;
    return result;
  }, {});

  console.log("result: ", result);

  return result;
}

const getContentData = async (
  startDate = new Date(new Date().getFullYear(), 0, 1),
  endDate = new Date()
) => {
  const request = validate(dashboardSchema, { startDate, endDate });
  try {
    const [
      totalViewsArticle,
      totalArticle,
      totalViewsVideo,
      totalVideo,
      popularVideo,
      popularArticle,
      fluctuationContent,
    ] = await Promise.all([
      getTotalArticleViews(),
      getTotalArticle(),
      getTotalVideoViews(),
      getTotalVideos(),
      getPopularVideo(),
      getPopularArticle(),
      getFluctuationContent()
    ]);

    return {
      totalViewersArticles: totalViewsArticle,
      totalArticle: totalArticle,
      totalViewsVideo: totalViewsVideo,
      totalVideo: totalVideo,
      popularVideo: popularVideo,
      popularArticle: popularArticle,
      fluctuationContent: fluctuationContent
    };
  } catch (error) {
    throw new ResponseError(500, `Error getting content data: ${error.message}`);
  }
}

export default {
  getDashboardData,
  getContentData
};