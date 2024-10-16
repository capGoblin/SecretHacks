import Navbar from "@/components/Navbar";
import { hackathons } from "@/types/const";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 max-w-7xl py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Explore Hackathons
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hackathons.map((hackathon, index) => (
            <Card
              key={index}
              id={hackathon.id}
              name={hackathon.title}
              network="Ethereum"
              startDate={new Date()}
              endDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)} // 30 days from now
              matchingPool={hackathon.matchingPool}
              description={hackathon.description}
              projectsCount={3}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function daysLeftToDate(futureDate: any) {
  const currentDate = new Date();
  const targetDate = new Date(futureDate);

  // Calculate the difference in milliseconds
  const diffTime = targetDate.getTime() - currentDate.getTime();

  // Convert milliseconds to days (1000 ms/s * 60 s/min * 60 min/hr * 24 hr/day)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

const Card = ({
  id,
  name,
  network,
  startDate,
  endDate,
  matchingPool,
  description,
  projectsCount,
}: {
  id: number | undefined;
  name: string | undefined;
  network: string | undefined;
  startDate: Date | undefined;
  endDate: Date | undefined;
  matchingPool: string | undefined;
  description: string | undefined;
  projectsCount: number | undefined;
}) => (
  <div className="rounded-2xl bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <Link
      href={`/${id}`}
      className="block p-5"
      data-testid="round-card"
      data-track-event="round-card"
    >
      <div className="space-y-3">
        <h2
          data-testid="round-name"
          className="text-xl font-bold text-gray-900"
        >
          {name}
        </h2>

        <div className="inline-block">
          <span className="text-xs text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
            {network}
          </span>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2">{description}</p>

        <div className="flex items-center space-x-3 text-sm">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
            ONLINE
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">
            OPEN
          </span>
          <span className="text-gray-500">
            STARTS {startDate?.toLocaleDateString()}
          </span>
        </div>

        <div className="pt-3 mt-3 border-t border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-2xl font-bold text-gray-900">{matchingPool}</p>
              <p className="text-sm text-gray-500">Matching Pool</p>
            </div>
            <p className="text-sm text-gray-500">
              {daysLeftToDate(endDate || new Date())} days left
            </p>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-600 text-sm">
              {projectsCount} projects
            </span>
            <span className="text-gray-600 text-sm">Quadratic Voting</span>
          </div>
        </div>
      </div>
    </Link>
  </div>
);
