import robot from "../assets/robot_img.webp"

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <img src={robot} alt="Broken Robot" className="w-96 mb-8" />
      <h1 className="text-2xl font-bold text-white mb-4">Oops... Sorry Something went wrong</h1>
      <p className="text-white">Try again later</p>
    </div>
  );
}
