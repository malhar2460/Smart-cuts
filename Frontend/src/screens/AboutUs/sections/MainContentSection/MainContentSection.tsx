import { ShieldIcon, StarIcon, UsersIcon } from "lucide-react";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/AboutUs_ui/card";

export const MainContentSection = (): JSX.Element => {
  // Leadership team data
  // const leadershipTeam = [
  //   {
  //     name: "Michael Anderson",
  //     title: "CEO & Founder",
  //     description: "15+ years of experience in salon industry innovation.",
  //     imageUrl: "..//img.png",
  //   },
  //   {
  //     name: "Sarah Chen",
  //     title: "Chief Technology Officer",
  //     description: "Former tech lead at major beauty platforms.",
  //     imageUrl: "..//img-1.png",
  //   },
  //   {
  //     name: "David Martinez",
  //     title: "Chief Operations Officer",
  //     description: "Scaling operations across global markets.",
  //     imageUrl: "..//img-2.png",
  //   },
  // ];

  // Core values data
  const coreValues = [
    {
      title: "Innovation",
      description:
        "Continuously pushing boundaries to create better solutions.",
      icon: <StarIcon className="w-6 h-6" />,
    },
    {
      title: "Customer Focus",
      description: "Putting our users first in everything we do.",
      icon: <UsersIcon className="w-6 h-6" />,
    },
    {
      title: "Integrity",
      description: "Maintaining the highest standards of professional ethics.",
      icon: <ShieldIcon className="w-6 h-6" />,
    },
  ];

  return (
    <section className="w-full max-w-[1328px] mx-auto py-16 px-8 font-['Poppins',Helvetica]">
      {/* Header Section */}
      <div className="mb-16">
        <h1 className="text-4xl font-bold text-gray-900 leading-9 mb-6">
          About SmartCuts
        </h1>
        <p className="text-xl text-gray-600 leading-5 max-w-[720px]">
          Revolutionizing the salon experience through innovative technology and
          exceptional service since 2020.
        </p>
      </div>

      {/* Mission and Vision Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <Card className="shadow-[0px_1px_2px_#0000000d] rounded-xl">
          <CardHeader className="pb-0">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-base text-gray-600">
              To transform the salon industry by providing cutting-edge
              scheduling solutions that empower both stylists and clients,
              creating seamless and memorable experiences.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-[0px_1px_2px_#0000000d] rounded-xl">
          <CardHeader className="pb-0">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Our Vision
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-base text-gray-600">
              To become the global standard for salon management, driving
              innovation and excellence in the beauty industry through
              technology.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Core Values Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 leading-6 mb-6">
          Core Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coreValues.map((value, index) => (
            <Card
              key={index}
              className="shadow-[0px_1px_2px_#0000000d] rounded-xl"
            >
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4">
                  <div className="text-blue-600">{value.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {value.title}
                  </h3>
                  <p className="text-base text-gray-600">{value.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Leadership Team Section */}
      <div>
        {/* <h2 className="text-2xl font-bold text-gray-900 leading-6 mb-6">
          Our Leadership Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> */}
          {/* {leadershipTeam.map((leader, index) => (
            <Card
              key={index}
              className="shadow-[0px_1px_2px_#0000000d] rounded-xl overflow-hidden"
            >
              <div
                className="h-48 w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${leader.imageUrl})` }}
              />
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {leader.name}
                </h3>
                <p className="text-base text-blue-600 mb-4">{leader.title}</p>
                <p className="text-base text-gray-600">{leader.description}</p>
              </CardContent>
            </Card>
          ))} */}
        {/* </div> */}
      </div>
    </section>
  );
};
