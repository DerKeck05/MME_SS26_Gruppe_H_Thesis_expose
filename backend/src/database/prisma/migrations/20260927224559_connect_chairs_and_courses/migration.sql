-- CreateTable
CREATE TABLE "_ChairToCourse" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ChairToCourse_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ChairToCourse_B_index" ON "_ChairToCourse"("B");

-- AddForeignKey
ALTER TABLE "_ChairToCourse" ADD CONSTRAINT "_ChairToCourse_A_fkey" FOREIGN KEY ("A") REFERENCES "Chair"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChairToCourse" ADD CONSTRAINT "_ChairToCourse_B_fkey" FOREIGN KEY ("B") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
