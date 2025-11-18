import Image from "next/image";
import Link from "next/link";

import ActionDropdown from "@/components/ActionDropDown";

import { FormattedDateTime } from "@/components/FormattedDateTime";
import Thumbnail from "@/components/Thumbnail";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFiles, getTotalSpaceUsed } from "@/app/actions/file.action";
import { convertFileSize, getUsageSummary } from "@/lib/utils";
import DoughnutChart from "@/components/DoughnutChart";

const Page = async () => {
  const [totalSpace, recentFiles] = await Promise.all([
    getTotalSpaceUsed(),
    getFiles({ sort: "$createdAt-desc", limit: 5 }),
  ]);
  const used = totalSpace?.used ?? 0;
  console.log("used", used);
  const total = totalSpace?.all ?? 2 * 1024 * 1024 * 1024;
  console.log("total", total);
  if (!used || !total) return null;
  const available = total - used;
  console.log("availabl", available);

  const usageSummary = getUsageSummary(totalSpace);
  console.log("usageSummary", usageSummary);

  return (
    <div className=" bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      {/* Header */}
      <div className="">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-600 mt-2">
          Welcome to your cloud storage overview
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Chart and Storage Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Chart Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                Storage Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 max-w-[200px] mx-auto">
                  {/* <Chart used={totalSpace?.used || 0} /> */}
                  <DoughnutChart
                    used={totalSpace?.used || 0}
                    total={totalSpace?.all || 2 * 1024 * 1024 * 1024}
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">
                        {totalSpace ? convertFileSize(totalSpace.used) : "0GB"}
                      </p>
                      <p className="text-sm text-blue-500 mt-1">Used</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {convertFileSize(available)}
                      </p>
                      <p className="text-sm text-green-500 mt-1">Available</p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          totalSpace
                            ? (totalSpace.used / totalSpace.all) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-slate-600 text-center">
                    {totalSpace
                      ? Math.round((totalSpace.used / totalSpace.all) * 100)
                      : 0}
                    % of 2GB used
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File Type Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {usageSummary.map((usage, index) => (
              <Link key={usage.title} href={usage.url}>
                <Card className={`${usage.color} backdrop-blur-sm border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] cursor-pointer group`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between ">
                      <div>
                        <p className="text-sm font-medium text-slate-600 group-hover:text-slate-800">
                          {usage.title}
                        </p>
                        <p className="text-lg font-bold text-slate-800 mt-1">
                          {convertFileSize(usage.size)}
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <Image
                          src={usage.icon}
                          alt={usage.title}
                          width={20}
                          height={20}
                          className="opacity-80"
                        />
                      </div>
                    </div>
                    {usage.latestDate && (
                      <div className="text-xs text-slate-500 mt-2">
                        Updated <FormattedDateTime date={usage.latestDate} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Column - Recent Files */}

        <div className="flex flex-col border p-2 rounded-2xl">
          <h1 className="mb-2 text-xl">Recently uploaded Files. </h1>

          <div>
            {recentFiles.documents.length > 0 ? (
              <div className="space-y-1 divide-y divide-slate-200 ">
                {recentFiles.documents.map((file) => (
                  <div
                    key={file.$id}
                    className="
    flex items-center gap-3 p-3 rounded-xl 
    
    transition-all duration-200  bg-blue-50
    hover:bg-slate-100 hover:shadow-md hover:scale-[1.01]"
                  >
                    <Thumbnail
                      type={file.type}
                      extension={file.extension}
                      url={file.url}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">
                        {file.name}
                      </p>
                    </div>
                    <ActionDropdown file={file} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No files uploaded yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
