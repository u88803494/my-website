import type { WordAnalysisResponse } from "@packages/shared/types";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import AIDictionaryContent from "../AIDictionaryContent";

interface MutationCallbacks {
  onError: (error: Error) => void;
  onSuccess: (data: WordAnalysisResponse) => void;
}

const mocks = vi.hoisted(() => ({
  addResult: vi.fn(),
  mutate: vi.fn(),
  onRegenerate: undefined as ((cardId: string) => void) | undefined,
  onSubmit: undefined as ((word: string) => void) | undefined,
  track: vi.fn(),
  updateResult: vi.fn(),
}));

vi.mock("@vercel/analytics", () => ({
  track: mocks.track,
}));

vi.mock("../../hooks/useWordAnalysis", () => ({
  useWordAnalysis: () => ({
    isPending: false,
    mutate: mocks.mutate,
  }),
}));

vi.mock("../../hooks/useWordLearning", () => ({
  useWordLearning: () => ({
    addResult: mocks.addResult,
    handleClearResults: vi.fn(),
    handleCompleteCard: vi.fn(),
    handleUndo: vi.fn(),
    testResults: [
      {
        id: "existing-card",
        response: { definitions: [], etymologyBlocks: [], queryWord: "existing" },
        timestamp: "2026-08-03",
        word: "existing",
      },
    ],
    updateResult: mocks.updateResult,
  }),
}));

vi.mock("../DonateModal", () => ({
  default: () => null,
}));

vi.mock("../LoadingState", () => ({
  default: () => null,
}));

vi.mock("../ResultsList", () => ({
  default: ({ onRegenerate }: { onRegenerate: (cardId: string) => void }) => {
    mocks.onRegenerate = onRegenerate;
    return null;
  },
}));

vi.mock("../WordSearchForm", () => ({
  default: ({ onSubmit }: { onSubmit: (word: string) => void }) => {
    mocks.onSubmit = onSubmit;
    return null;
  },
}));

const successfulResponse: WordAnalysisResponse = {
  definitions: [],
  etymologyBlocks: [],
  queryWord: "record",
};

const renderContent = () => {
  renderToStaticMarkup(<AIDictionaryContent />);
};

const getMutationCallbacks = (callIndex: number): MutationCallbacks => {
  const callbacks = mocks.mutate.mock.calls[callIndex]?.[1];
  if (!callbacks) throw new Error(`Missing mutation callbacks for call ${callIndex}`);

  return callbacks as MutationCallbacks;
};

describe("AIDictionaryContent analytics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.onRegenerate = undefined;
    mocks.onSubmit = undefined;
  });

  it("tracks an initial search submission before starting the mutation", () => {
    renderContent();
    mocks.onSubmit?.("record");

    expect(mocks.track).toHaveBeenCalledExactlyOnceWith("dictionary_search_submitted");
    expect(mocks.mutate).toHaveBeenCalledOnce();
    expect(mocks.track.mock.invocationCallOrder[0]).toBeLessThan(mocks.mutate.mock.invocationCallOrder[0] ?? 0);
  });

  it("tracks a successful initial search without including the query", () => {
    renderContent();
    mocks.onSubmit?.("record");
    getMutationCallbacks(0).onSuccess(successfulResponse);

    expect(mocks.track).toHaveBeenNthCalledWith(1, "dictionary_search_submitted");
    expect(mocks.track).toHaveBeenNthCalledWith(2, "dictionary_search_succeeded");
    expect(mocks.addResult).toHaveBeenCalledExactlyOnceWith("record", successfulResponse);
    expect(mocks.track.mock.calls.every((call) => call.length === 1)).toBe(true);
  });

  it("does not track searches when regenerating an existing result", () => {
    renderContent();
    mocks.onRegenerate?.("existing-card");
    getMutationCallbacks(0).onSuccess(successfulResponse);

    expect(mocks.track).not.toHaveBeenCalled();
    expect(mocks.updateResult).toHaveBeenCalledExactlyOnceWith("existing-card", successfulResponse);
  });
});
