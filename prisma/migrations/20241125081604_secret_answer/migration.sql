-- CreateTable
CREATE TABLE "SecretQuestion" (
    "question_id" SERIAL NOT NULL,
    "question_text" TEXT NOT NULL,

    CONSTRAINT "SecretQuestion_pkey" PRIMARY KEY ("question_id")
);

-- CreateTable
CREATE TABLE "SecretAnswer" (
    "answer_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "answer_text" TEXT NOT NULL,

    CONSTRAINT "SecretAnswer_pkey" PRIMARY KEY ("answer_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SecretAnswer_user_id_key" ON "SecretAnswer"("user_id");

-- AddForeignKey
ALTER TABLE "SecretAnswer" ADD CONSTRAINT "SecretAnswer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecretAnswer" ADD CONSTRAINT "SecretAnswer_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "SecretQuestion"("question_id") ON DELETE RESTRICT ON UPDATE CASCADE;
