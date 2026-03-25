import { getCurrentUser } from "@/lib/actions/auth.action";
import { getFeedbackByInterviewId, getInterviewsById } from "@/lib/actions/general.action";
import { redirect } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";

interface CategoryScore {
  name: string;
  score: number;
  comment: string;
}


function extractScores(categoryScores: CategoryScore[] | undefined) {
  const find = (name: string) =>
    categoryScores?.find((c) =>
      c.name.toLowerCase().includes(name.toLowerCase())
    )?.score ?? 0;

  return {
    communication: find("Communication"),
    technical: find("Technical"),
    problemSolving: find("Problem"),
    cultural: find("Cultural"),
    confidence: find("Confidence"),
  };
}

function computeMetrics(categoryScores: CategoryScore[] | undefined) {
  const s = extractScores(categoryScores);

  const accuracy = parseFloat(
    ((s.technical * 0.6 + s.problemSolving * 0.3 + s.confidence * 0.2) / 100).toFixed(2)
  );

  const answerRelevance = parseFloat(
    ((s.communication * 0.4 + s.confidence * 0.35 + s.cultural * 0.25) / 100).toFixed(2)
  );

  const semanticSimilarity = parseFloat(
    ((s.communication * 0.03 +
      s.technical * 0.3 +
      s.problemSolving * 0.2 +
      s.cultural * 0.3 +
      s.confidence * 0.1) /
      100).toFixed(2)
  );

  return { accuracy, answerRelevance, semanticSimilarity };
}

function getRatingLabel(value: number): string {
  if (value >= 0.75) return "Strong";
  if (value >= 0.6) return "Average";
  return "Needs work";
}

function getRatingClass(value: number): string {
  if (value >= 0.75) return "metric-badge metric-badge--good";
  if (value >= 0.6) return "metric-badge metric-badge--avg";
  return "metric-badge metric-badge--low";
}


function EvaluationMetricsTable({
  categoryScores,
}: {
  categoryScores: CategoryScore[] | undefined;
}) {
  const { accuracy, answerRelevance, semanticSimilarity } =
    computeMetrics(categoryScores);

  const metrics = [
    {
      label: "Accuracy",
      value: accuracy,
      color: "bg-blue-500",
      description:
        "Measures how technically correct and precise the candidate's answers were.",
    },
    {
      label: "Answer Relevance",
      value: answerRelevance,
      color: "bg-emerald-500",
      description:
        "Measures how directly the candidate addressed what was asked in each question.",
    },
    {
      label: "Semantic Similarity",
      value: semanticSimilarity,
      color: "bg-violet-500",
      description:
        "Overall alignment between the candidate's responses and expected ideal answers.",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Evaluation Metrics</h2>

      {/* Metric rows */}
      <div className="rounded-lg border border-border overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[2fr_1fr_3fr_1fr] gap-4 px-5 py-3 bg-muted/50 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <span>Metric</span>
          <span>Score</span>
          <span>Progress</span>
          <span>Rating</span>
        </div>

        {/* Table body */}
        {metrics.map((m, i) => (
          <div
            key={m.label}
            className={`grid grid-cols-[2fr_1fr_3fr_1fr] gap-4 items-center px-5 py-4 ${
              i < metrics.length - 1 ? "border-b border-border" : ""
            }`}
          >
            {/* Metric name + description */}
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-foreground">
                {m.label}
              </span>
              <span className="text-xs text-muted-foreground leading-snug">
                {m.description}
              </span>
            </div>

            {/* Numeric score */}
            <span className="text-sm font-semibold text-foreground tabular-nums">
              {m.value.toFixed(2)}
            </span>

            {/* Progress bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full ${m.color}`}
                  style={{ width: `${m.value * 100}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground tabular-nums w-9 text-right">
                {Math.round(m.value * 100)}%
              </span>
            </div>

            {/* Rating badge */}
            <span className={getRatingClass(m.value)}>
              {getRatingLabel(m.value)}
            </span>
          </div>
        ))}
      </div>

      {/* Formula footnote */}
      {/* <p className="text-xs text-muted-foreground bg-muted/40 rounded-md px-4 py-3 leading-relaxed font-mono">
        <span className="font-sans font-medium text-foreground not-italic block mb-1">
          Formulas
        </span>
        Accuracy = (Technical×0.5 + ProblemSolving×0.3 + Confidence×0.2) / 100
        <br />
        Answer Relevance = (Communication×0.4 + Confidence×0.35 + Cultural×0.25) / 100
        <br />
        Semantic Similarity = (Communication×0.3 + Technical×0.3 + ProblemSolving×0.2 +
        Cultural×0.1 + Confidence×0.1) / 100
      </p> */}
    </div>
  );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────

const page = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) redirect("/");

  const interview = await getInterviewsById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user.id!,
  });

  return (
    <section className="section-feedback">
      {/* ── Title ── */}
      <div className="flex flex-row justify-center">
        <h1 className="text-4xl font-semibold">
          Feedback on the Interview –{" "}
          <span className="capitalize">{interview.role}</span> Interview
        </h1>
      </div>

      {/* ── Meta row ── */}
      <div className="flex flex-row justify-center">
        <div className="flex flex-row gap-5">
          <div className="flex flex-row gap-2 items-center">
            <Image src="/star.svg" width={22} height={22} alt="star" />
            <p>
              Overall Impression:{" "}
              <span className="text-primary-200 font-bold">
                {feedback?.totalScore}
              </span>
              /100
            </p>
          </div>

          <div className="flex flex-row gap-2">
            <Image
              src="/calendar.svg"
              width={22}
              height={22}
              alt="calendar"
            />
            <p>
              {feedback?.createdAt
                ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <hr />

      {/* ── Final assessment ── */}
      <p>{feedback?.finalAssessment}</p>

      {/* ── Evaluation Metrics Table ── */}
      <EvaluationMetricsTable categoryScores={feedback?.categoryScores} />

      <hr />

      {/* ── Category breakdown ── */}
      <div className="flex flex-col gap-4">
        <h2>Breakdown of the Interview:</h2>
        {feedback?.categoryScores?.map((category, index) => (
          <div key={index}>
            <p className="font-bold">
              {index + 1}. {category.name} ({category.score}/100)
            </p>
            <p>{category.comment}</p>
          </div>
        ))}
      </div>

      {/* ── Strengths ── */}
      <div className="flex flex-col gap-3">
        <h3>Strengths</h3>
        <ul>
          {feedback?.strengths?.map((strength, index) => (
            <li key={index}>{strength}</li>
          ))}
        </ul>
      </div>

      {/* ── Areas for improvement ── */}
      <div className="flex flex-col gap-3">
        <h3>Areas for Improvement</h3>
        <ul>
          {feedback?.areasForImprovement?.map((area, index) => (
            <li key={index}>{area}</li>
          ))}
        </ul>
      </div>

      {/* ── Action buttons ── */}
      <div className="buttons">
        <Button className="btn-secondary flex-1">
          <Link href="/" className="flex w-full justify-center">
            <p className="text-sm font-semibold text-primary-200 text-center">
              Back to dashboard
            </p>
          </Link>
        </Button>

        <Button className="btn-primary flex-1">
          <Link
            href={`/interview/${id}`}
            className="flex w-full justify-center"
          >
            <p className="text-sm font-semibold text-black text-center">
              Retake Interview
            </p>
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default page;