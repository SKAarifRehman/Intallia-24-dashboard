import React, { useEffect, useState } from "react";
import axios from "axios";

interface ChildScreen {
  ScreenId: string;
  ScreenName: string;
  ParentName: string;
  UserGroupId: string;
  ReadPermission: boolean;
  WritePermission: boolean;
  DeletePermission: boolean;
}

interface ParentScreen {
  ScreenId: string;
  ScreenName: string;
  ParentName: string;
  ScreenNameData: ChildScreen[];
}

import { MainLayout } from "@/components/layout/MainLayout";

const UserGroupDetails: React.FC = () => {
  const [data, setData] = useState<ParentScreen[]>([]);
  const [enabledScreens, setEnabledScreens] = useState<{
    [key: string]: boolean;
  }>({});
  const [permissions, setPermissions] = useState<{
    [screenId: string]: {
      ReadPermission: boolean;
      WritePermission: boolean;
      DeletePermission: boolean;
    };
  }>({});

  const userGroupId = "Admin"; // static for now
  const companyId = "Intallia24";

  const fetchData = async () => {
    try {
      const payload = {
        JSON: JSON.stringify({
          Header: [{ UserGroupId: userGroupId, CompanyId: companyId }],
          Response: [{ ResponseText: "", ErrorCode: "" }],
        }),
      };

      const res = await axios.post(
        "http://3.6.31.102/Intallia24/api/Intallia24/GetScreenGroup",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      setData(res.data);

      const initEnabled: { [key: string]: boolean } = {};
      const initPermissions: typeof permissions = {};

      res.data.forEach((parent: ParentScreen) => {
        initEnabled[parent.ScreenId] = parent.ScreenNameData.some(
          (child) =>
            child.ReadPermission ||
            child.WritePermission ||
            child.DeletePermission,
        );

        parent.ScreenNameData.forEach((child) => {
          initPermissions[child.ScreenId] = {
            ReadPermission: child.ReadPermission,
            WritePermission: child.WritePermission,
            DeletePermission: child.DeletePermission,
          };
        });
      });

      setEnabledScreens(initEnabled);
      setPermissions(initPermissions);
    } catch (error) {
      console.error("Failed to fetch screen group:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const handleToggle = (screenId: string) => {
    setEnabledScreens((prev) => ({
      ...prev,
      [screenId]: !prev[screenId],
    }));
  };

  const handlePermissionChange = (
    screenId: string,
    permissionType: "ReadPermission" | "WritePermission" | "DeletePermission",
  ) => {
    setPermissions((prev) => ({
      ...prev,
      [screenId]: {
        ...prev[screenId],
        [permissionType]: !prev[screenId][permissionType],
      },
    }));
  };

  return (
    <MainLayout>
      <div className="p-8 ">
        <div className="flex justify-between items-center mb-10">
          <h1 className="page-heading">Roles And Access</h1>
        </div>

        {data.map((parent) => (
          <div
            key={parent.ScreenId}
            className="bg-white border rounded-lg p-4 mb-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-base font-medium">{parent.ScreenName}</span>
              <label className="inline-flex relative items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabledScreens[parent.ScreenId]}
                  onChange={() => handleToggle(parent.ScreenId)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-gray-300 rounded-full peer peer-checked:bg-sky-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>

            {enabledScreens[parent.ScreenId] && (
              <div className="mt-4 ml-2 space-y-2">
                {parent.ScreenNameData.map((child) => (
                  <div
                    key={child.ScreenId}
                    className="flex items-center justify-between"
                  >
                    <div className="text-gray-800 text-sm w-1/3">
                      {child.ScreenName}
                    </div>

                    <div className="flex gap-4 items-center">
                      <label className="flex items-center gap-1 text-sm font-medium">
                        <input
                          type="checkbox"
                          checked={
                            permissions[child.ScreenId]?.ReadPermission || false
                          }
                          onChange={() =>
                            handlePermissionChange(
                              child.ScreenId,
                              "ReadPermission",
                            )
                          }
                          className="w-4 h-4 text-sky-500 accent-sky-500 border-gray-300 rounded"
                        />
                        View Only
                      </label>

                      <label className="flex items-center gap-1 text-sm font-medium">
                        <input
                          type="checkbox"
                          checked={
                            permissions[child.ScreenId]?.WritePermission ||
                            false
                          }
                          onChange={() =>
                            handlePermissionChange(
                              child.ScreenId,
                              "WritePermission",
                            )
                          }
                          className="w-4 h-4 text-sky-500 accent-sky-500 border-gray-300 rounded"
                        />
                        Edit
                      </label>

                      <label className="flex items-center gap-1 text-sm font-medium">
                        <input
                          type="checkbox"
                          checked={
                            permissions[child.ScreenId]?.DeletePermission ||
                            false
                          }
                          onChange={() =>
                            handlePermissionChange(
                              child.ScreenId,
                              "DeletePermission",
                            )
                          }
                          className="w-4 h-4 text-sky-500 accent-sky-500 border-gray-300 rounded"
                        />
                        Delete
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default UserGroupDetails;
