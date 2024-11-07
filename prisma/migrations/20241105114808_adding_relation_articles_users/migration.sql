-- AddForeignKey
ALTER TABLE "Articles" ADD CONSTRAINT "Articles_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "Users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
