import React from "react";

const Loader = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="loader-icon-rotate"
  >
    <path d="M2 12c0-2.8 2.2-5 5-5s5 2.2 5 5 2.2 5 5 5 5-2.2 5-5" />
    <path d="M7 20.7a1 1 0 1 1 5-8.7 1 1 0 1 0 5-8.6" />
    <path d="M7 3.3a1 1 0 1 1 5 8.6 1 1 0 1 0 5 8.6" />
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const Wave = () => (
  <svg
    width="100%"
    height="100%"
    id="svg"
    viewBox="0 0 1440 590"
    xmlns="http://www.w3.org/2000/svg"
    class="transition duration-300 ease-in-out delay-150"
  >
    <defs>
      <linearGradient id="gradient" x1="0%" y1="50%" x2="100%" y2="50%">
        <stop offset="5%" stopColor="#F78DA7"></stop>
        <stop offset="95%" stopColor="#8ED1FC"></stop>
      </linearGradient>
    </defs>
    <path
      d="M 0,600 L 0,150 C 119.13875598086128,183.3397129186603 238.27751196172255,216.6794258373206 325,202 C 411.72248803827745,187.3205741626794 466.02870813397124,124.62200956937797 567,113 C 667.9712918660288,101.37799043062203 815.6076555023923,140.8325358851675 910,139 C 1004.3923444976077,137.1674641148325 1045.5406698564593,94.04784688995215 1125,89 C 1204.4593301435407,83.95215311004785 1322.2296650717703,116.97607655502392 1440,150 L 1440,600 L 0,600 Z"
      stroke="none"
      strokeWidth="0"
      fill="url(#gradient)"
      fillOpacity="0.53"
      class="transition-all duration-300 ease-in-out delay-150 path-0"
    ></path>
    <defs>
      <linearGradient id="gradient" x1="0%" y1="50%" x2="100%" y2="50%">
        <stop offset="5%" stopColor="#F78DA7"></stop>
        <stop offset="95%" stopColor="#8ED1FC"></stop>
      </linearGradient>
    </defs>
    <path
      d="M 0,600 L 0,350 C 84.92822966507177,344.60287081339715 169.85645933014354,339.2057416267943 276,340 C 382.14354066985646,340.7942583732057 509.5023923444976,347.7799043062201 605,361 C 700.4976076555024,374.2200956937799 764.133971291866,393.6746411483254 846,382 C 927.866028708134,370.3253588516746 1027.9617224880383,327.52153110047846 1130,317 C 1232.0382775119617,306.47846889952154 1336.0191387559807,328.2392344497608 1440,350 L 1440,600 L 0,600 Z"
      stroke="none"
      strokeWidth="0"
      fill="url(#gradient)"
      fillOpacity="1"
      class="transition-all duration-300 ease-in-out delay-150 path-1"
    ></path>
  </svg>
);

const Icon = {
  Loader,
  Wave,
};

export default Icon;
