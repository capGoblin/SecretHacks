import React from "react";
import Image from "next/image";
import { X, Globe, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Project {
  projectCoverUrl?: string;
  projectLogoUrl: string;
  name: string;
  ownerAddress: string;
  createdDate: string;
  website: string;
  twitterUrl: string;
  description: string;
  fundingSources: string;
  teamSize: number;
  fundingReceived?: number;
  contributors?: number;
  monthsToGo?: number;
}

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <Image
            src={
              project.projectCoverUrl ||
              "/placeholder.svg?height=200&width=1200"
            }
            alt="Project header"
            width={1200}
            height={200}
            className="w-full h-48 object-cover rounded-t-2xl"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-1 shadow-md"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Image
              src={project.projectLogoUrl}
              alt={`${project.name} logo`}
              width={60}
              height={60}
              className="rounded-full border-4 border-white shadow-lg"
            />
            <h2 className="text-2xl font-bold">{project.name}</h2>
          </div>

          <div className="text-sm text-gray-600 mb-4 flex items-center space-x-4">
            <div className="flex items-center">
              <span className="mr-2">🔗</span>
              <p>{project.ownerAddress}</p>
            </div>
            <div className="flex items-center">
              <span className="mr-2">📅</span>
              <p>
                Created on: {new Date(project.createdDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex space-x-4 mb-6">
            <a
              href={project.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-600 hover:text-green-600"
            >
              <Globe className="h-4 w-4 mr-1" />
              {project.website}
            </a>
            <a
              href={project.twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-600 hover:text-blue-400"
            >
              <Twitter className="h-4 w-4 mr-1" />
              {project.twitterUrl.split("/").pop()}
            </a>
          </div>

          <div className="flex">
            <div className="flex-grow pr-6">
              <Tabs defaultValue="details" className="mb-6">
                <TabsList className="border-b border-gray-200 mb-4">
                  <TabsTrigger
                    value="details"
                    className="text-sm font-medium text-gray-500 hover:text-gray-700 px-4 py-2 border-b-2 border-transparent hover:border-gray-300"
                  >
                    Project Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="code"
                    className="text-sm font-medium text-gray-500 hover:text-gray-700 px-4 py-2 border-b-2 border-transparent hover:border-gray-300"
                  >
                    Code Metrics
                  </TabsTrigger>
                  <TabsTrigger
                    value="chain"
                    className="text-sm font-medium text-gray-500 hover:text-gray-700 px-4 py-2 border-b-2 border-transparent hover:border-gray-300"
                  >
                    On-Chain Metrics
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="details">
                  <h3 className="font-semibold mb-2">About</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <h3 className="font-semibold mb-2">Additional Information</h3>
                  <p className="text-gray-600">
                    Funding Sources: {project.fundingSources}
                  </p>
                  <p className="text-gray-600">Team Size: {project.teamSize}</p>
                </TabsContent>
                <TabsContent value="code">
                  Code metrics content here
                </TabsContent>
                <TabsContent value="chain">
                  On-chain metrics content here
                </TabsContent>
              </Tabs>
            </div>

            <div className="w-64 bg-gray-100 p-4 rounded-lg flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <p className="text-2xl font-bold">
                    ${project.fundingReceived || 220}
                  </p>
                  <p className="text-sm text-gray-600">
                    funding received in current round
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    ${project.contributors || 220}
                  </p>
                  <p className="text-sm text-gray-600">contributors</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {project.monthsToGo || 220} months
                  </p>
                  <p className="text-sm text-gray-600">to go</p>
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                  Contribute
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-green-500 text-green-500 hover:bg-green-50"
                >
                  Claim Rewards
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
