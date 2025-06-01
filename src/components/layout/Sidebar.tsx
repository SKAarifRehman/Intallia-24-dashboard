
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LogOut, ChevronDown, ChevronRight } from "lucide-react";
import axios from "axios";

import userlogo from "@/assets/super_admin.png";
import dashbordIcon from "@/assets/Dashbord-icon.svg";
import account from "@/assets/account.svg";
import simulation from "@/assets/Simulation-.svg";
import planspackage from "@/assets/Plans & Package.svg";
import skillmatrix from "@/assets/SkillMatrix.svg";
import currencyDollar from "@/assets/CurrencyDollar.svg";
import invitations from "@/assets/Invitations-.svg";

const iconMap: Record<string, string> = {
  "Dashboard": dashbordIcon,
  "Roles & Access": account,
  "User Management": account,
  "Simulation": simulation,
  "Skill Matrix": skillmatrix,
  "Plans & Package": planspackage,
  "invitations": invitations,
  "Payments": currencyDollar,
};

const screenRouteMap = {
  "Dashboard": "/",
  "Roles & Access": "/roles",
  "User Management": "/user",
  "Company": "/company",
  "Add Company": "/company/add-company",
  "Users": "/users",
  "Add User": "/add-new-user",
  "User Assignment": "/user-assignment",
  "Simulation": "/simulation",
  "New Simulation": "/new-simulation",
  "Skill Matrix": "/skill-matrix",
  "Plans & Package": "/plans-package",
  "Plans": "/plans-package",
  "Package": "/plans-package",
  "Add Package": "/add-package",
  "Payments": "/payments",
  "Invitations": "/invitations",
  "Profile": "/profile",
  "Score": "/score",
  "Preferences": "/preferences",
};

export function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpand = (label: string) => {
  setExpandedItems((prev) => ({
    ...prev,
    [label]: !prev[label],  // toggle true/false for that label
  }));
};


  const fetchMenuData = async () => {
    try {
      const payload = {
        JSON: JSON.stringify({
          Header: [{ UserGroupId: "Admin", CompanyId: "Intallia24" }],
          Response: [{ ResponseText: "", ErrorCode: "" }],
        }),
      };

      const response = await axios.post(
        "http://3.6.31.102/Intallia24/api/Intallia24/GetLeftPane",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const transformMenu = (items: any[]): any[] => {
        return items.map((item) => ({
          img: iconMap[item.ScreenName] || account,
          label: item.ScreenName,
          href: screenRouteMap[item.ScreenName] || `/${item.ScreenName.toLowerCase().replace(/\s+/g, "-")}`,
          subroutes: item.ScreenNameData ? transformMenu(item.ScreenNameData) : undefined,
        }));
      };

      const transformed = transformMenu(response.data);
      console.log(response.data);


      setMenuItems([
        {
          img: dashbordIcon,
          label: "Dashboard",
          href: "/",
        },
        ...transformed,
      ]);
    } catch (error) {
      console.error("Failed to fetch sidebar data:", error);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  const renderSubroutes = (subroutes: any[], parentLabel: string = "") => {
  return (
    <div className="ml-6 mt-2 space-y-1">
      {subroutes.map((subroute: any, idx: number) => {
        const isActive =
          currentPath === subroute.href ||
          subroute.subroutes?.some((s: any) => currentPath === s.href);

        const isExpanded = expandedItems[subroute.label] || isActive;

        return (
          <div key={`${parentLabel}-${idx}`} className="relative">
            {/* L-shaped border */}
            <div
              className={cn(
                "absolute left-[-16px] w-[16px] border-l-2 border-b-2 h-[24px] border-gray-300",
                (currentPath === subroute.href ||
                  subroute.subroutes?.some(
                    (sr) => currentPath === sr.href
                  )) && "border-[#0DAFDC]"
              )}
            />

            <div
              onClick={() =>
                subroute.subroutes ? toggleExpand(subroute.label) : null
              }
              className={cn(
                "flex items-center justify-between cursor-pointer px-3 py-2 rounded-md text-sm",
                !isActive && "hover:bg-gray-50 text-gray-700",
                isActive && "text-[#0DAFDC] bg-[#0DAFDC10]"
              )}
            >
              <Link to={subroute.href} className="flex items-center gap-2 w-full">
                <span>{subroute.label}</span>
              </Link>
              {subroute.subroutes &&
                (isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                ))}
            </div>

            {isExpanded && subroute.subroutes && renderSubroutes(subroute.subroutes, subroute.label)}
          </div>
        );
      })}
    </div>
  );
};


  return (
    <div className="h-screen w-64 bg-sidebar fixed left-0 top-0 border-r border-sidebar-border overflow-y-auto">
      <div className="p-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
        <div className="mb-8">
          <img src="/Group 2337.svg" alt="Logo" />
        </div>

        <nav className="space-y-2">
          {menuItems.map((item, index) => {
            const isActive =
              currentPath === item.href ||
              item.subroutes?.some((s: any) => currentPath === s.href) ||
              (item.subroutes && item.subroutes.some((sub: any) =>
                sub.subroutes?.some((ss: any) => currentPath === ss.href)
              ));

            const isExpanded = expandedItems[item.label] || isActive;

            return (
              <div key={index}>
                <div
                  onClick={() => item.subroutes && toggleExpand(item.label)}
                  className={cn(
                    "flex items-center justify-between cursor-pointer px-3 py-2 rounded-md",
                    !isActive &&
                      "hover:bg-gray-300 text-sidebar-foreground transition-colors duration-200",
                    isActive &&
                      "bg-[linear-gradient(90deg,#0DAFDC_0%,#22E9A2_100%)] text-white"
                  )}
                >
                  <Link
                    to={item.subroutes && item.subroutes.length > 0 ? item.subroutes[0].href : item.href}
                    className="flex items-center gap-3 w-full"
                  >
                    {item.img && <img src={item.img} className="h-5 w-5" />}
                    <span>{item.label}</span>
                  </Link>
                  {item.subroutes &&
                    (isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    ))}
                </div>

                {isExpanded && item.subroutes && renderSubroutes(item.subroutes, item.label)}
              </div>
            );
          })}
        </nav>
      </div>

      <div className="absolute bottom-8 w-full px-6">
        <div className="flex items-center gap-3 px-3 py-4 border-t border-sidebar-border">
          <div className="w-10 h-18 rounded-full bg-sidebar-accent overflow-hidden">
            <Link to="/profile">
              <img src={userlogo} alt="User" className="w-full" />
            </Link>
          </div>
          <div>
            <p className="font-medium text-sidebar-foreground">John Watson</p>
            <p className="text-sm text-sidebar-foreground/60">Super Admin</p>
          </div>
        </div>

        <button className="flex items-center gap-3 px-3 py-2 w-full text-sidebar-foreground/60 hover:text-sidebar-foreground">
          <LogOut className="h-5 w-5 text-red-600" />
          <span className="text-red-600 font-normal text-base/5">Logout</span>
        </button>
      </div>
    </div>
  );
}
