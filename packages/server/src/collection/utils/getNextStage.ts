export default function getNextStage(
  stage: number,
  sessionMistakes: number
): number {
  if (stage === 0) {
    return 1;
  }
  if (sessionMistakes === 0) {
    return stage + 1;
  }
  return stage;
}
