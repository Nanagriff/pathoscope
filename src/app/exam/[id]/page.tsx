import { notFound } from "next/navigation";
import { exams } from "@/data/exams";
import SVGExamViewer from "@/components/SVGExamViewer";

export function generateStaticParams() {
  return exams.map((e) => ({ id: e.id }));
}

export default async function ExamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exam = exams.find((e) => e.id === id);

  if (!exam) {
    notFound();
  }

  return (
    <div className="h-dvh overflow-hidden">
      <SVGExamViewer exam={exam} />
    </div>
  );
}
