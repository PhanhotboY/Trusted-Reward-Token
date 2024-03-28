export default function Balance({
  rewardToken,
  penaltyToken,
  reputationToken,
}: Record<string, number>) {
  const tokenStyle = "rounded-full text-white text-xs px-1 py-2 mr-2 ";

  return (
    <div className="flex items-center">
      <div className="mr-3">
        <span className={tokenStyle + "bg-green-500 aspect-square"}>REW</span>
        <span>{rewardToken || 0}</span>
      </div>
      <div className="mr-3">
        <span className={tokenStyle + "bg-red-500"}>PEN</span>
        <span>{penaltyToken || 0}</span>
      </div>
      <div className="mr-3">
        <span className={tokenStyle + "bg-blue-500"}>REP</span>
        <span>{reputationToken || 0}</span>
      </div>
    </div>
  );
}
