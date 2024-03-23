export default function AddButton({ clickHandler }: { clickHandler?: () => void }) {
  return (
    <button
      className="fixed bottom-8 aspect-square right-8 bg-green-500 text-white px-5 font-bold rounded-full"
      onClick={clickHandler}
    >
      +
    </button>
  );
}
