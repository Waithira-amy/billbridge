type CampaignIllustrationProps = {
  id: string;
  title: string;
  category: string;
};

function Person({
  x,
  y,
  scale = 1,
  skin,
  clothes,
  hair = "#211916",
}: {
  x: number;
  y: number;
  scale?: number;
  skin: string;
  clothes: string;
  hair?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M25 218c3-43 14-70 36-77h48c23 8 33 36 36 77z" fill={clothes} />
      <path d="M60 132v-24h50v24l-25 19z" fill={skin} />
      <ellipse cx="85" cy="68" rx="42" ry="48" fill={skin} />
      <path d="M43 70c-5-39 14-61 43-61 30 0 48 20 41 61l-9-19c-18 7-43 5-65-2z" fill={hair} />
      <path d="M55 62c4-28 19-44 37-46-8 16-21 27-37 31z" fill={hair} opacity=".75" />
      <circle cx="70" cy="73" r="3" fill="#231815" />
      <circle cx="101" cy="73" r="3" fill="#231815" />
      <path d="M75 91c7 6 15 6 22 0" fill="none" stroke="#7c3f35" strokeWidth="3" strokeLinecap="round" />
      <path d="M62 151c-24 16-36 38-42 60M111 151c22 14 36 35 43 57" fill="none" stroke={skin} strokeWidth="17" strokeLinecap="round" />
    </g>
  );
}

function StudentScene({ second = false }: { second?: boolean }) {
  return (
    <>
      <rect x="120" y="100" width="560" height="270" rx="28" fill="#fff8e9" />
      <path d="M120 322h560v48H120z" fill="#e7bd7c" />
      <Person x={second ? 190 : 245} y={104} scale={1.03} skin="#70412f" clothes="#1b6b65" />
      {second && <Person x={390} y={125} scale={.85} skin="#9b5b3d" clothes="#d67742" hair="#201916" />}
      <g className="campaign-float">
        <path d="M425 218h124a14 14 0 0114 14v91H425z" fill="#f1bd57" />
        <path d="M440 231h95v73h-95z" fill="#fff1ca" />
        <path d="M487 231v73" stroke="#c77b3b" strokeWidth="5" />
        <path d="M449 246h28m-28 13h28m30-13h19m-19 13h19" stroke="#db9860" strokeWidth="4" strokeLinecap="round" />
      </g>
      <circle cx="595" cy="151" r="30" fill="#f2d88c" />
      <path d="M577 150h36m-18-18v36" stroke="#fff8e9" strokeWidth="6" strokeLinecap="round" />
    </>
  );
}

function MaternityScene() {
  return (
    <>
      <rect x="114" y="98" width="572" height="274" rx="30" fill="#f3f6ff" />
      <path d="M615 124v58m-29-29h58" stroke="#73a6c4" strokeWidth="13" strokeLinecap="round" />
      <rect x="180" y="285" width="430" height="48" rx="22" fill="#9fc3d7" />
      <Person x={246} y={94} scale={.92} skin="#804731" clothes="#bd6f83" hair="#1d1615" />
      <g className="campaign-float">
        <path d="M374 255c-22-24-57-2-41 24l42 43 43-44c17-24-19-47-44-23z" fill="#f4c7b9" />
        <circle cx="375" cy="270" r="19" fill="#8e5138" />
        <path d="M356 268c1-19 14-29 29-27 14 2 21 14 16 29-7-9-17-13-31-11l-14 9z" fill="#211815" />
        <path d="M357 300c9-12 29-17 42-4l15 22h-71z" fill="#f3e0cc" />
      </g>
    </>
  );
}

function HospitalScene() {
  return (
    <>
      <rect x="112" y="102" width="576" height="270" rx="30" fill="#eff8f7" />
      <rect x="145" y="130" width="104" height="90" rx="16" fill="#d8eeee" />
      <path d="M197 149v51m-25-26h50" stroke="#fff" strokeWidth="13" strokeLinecap="round" />
      <rect x="160" y="286" width="475" height="52" rx="20" fill="#6fa7b5" />
      <path d="M205 235h345a20 20 0 0120 20v42H205z" fill="#fff" />
      <Person x={345} y={90} scale={.88} skin="#75432e" clothes="#257c80" />
      <path d="M397 279c9-30 28-41 57-41h92v48H397z" fill="#bedde0" />
      <circle cx="527" cy="242" r="19" fill="#7c4934" />
      <path d="M507 238c2-16 13-25 25-23 12 2 17 11 13 23-11-5-24-4-38 4z" fill="#211916" />
      <g className="campaign-pulse">
        <path d="M552 193v-17m-9 9h18" stroke="#d96a65" strokeWidth="6" strokeLinecap="round" />
      </g>
    </>
  );
}

function WaterScene() {
  return (
    <>
      <rect x="108" y="104" width="584" height="268" rx="30" fill="#e8f5f3" />
      <circle cx="597" cy="153" r="38" fill="#f1c56e" />
      <path d="M108 294c112-48 208-30 307 0 112 35 176 13 277-14v92H108z" fill="#9bca9b" />
      <path d="M468 164h105v132H468z" fill="#4f95a0" />
      <path d="M453 164h135l-20-30h-96z" fill="#367882" />
      <path d="M520 296v34m-42-34v34m84-34v34" stroke="#5d5040" strokeWidth="10" strokeLinecap="round" />
      <path d="M431 230h143m-143 16h143" stroke="#d1e8e8" strokeWidth="6" opacity=".8" />
      <Person x={188} y={115} scale={.84} skin="#8a5238" clothes="#c9793e" />
      <Person x={322} y={140} scale={.72} skin="#5f382c" clothes="#347d66" />
      <g className="campaign-drop">
        <path d="M520 214c-15 19-14 27 0 33 14-6 15-14 0-33z" fill="#d9f4f5" />
      </g>
      <path d="M591 316h37m-18-17v17" stroke="#fff8e9" strokeWidth="6" strokeLinecap="round" />
    </>
  );
}

function SolarScene() {
  return (
    <>
      <rect x="110" y="102" width="580" height="270" rx="30" fill="#fff5df" />
      <circle cx="601" cy="154" r="39" fill="#f2c469" />
      <path d="M110 298c130-47 271-17 360 4 88 20 145 12 220-17v87H110z" fill="#98c698" />
      <path d="M401 155l103-27 31 91-106 25z" fill="#326c82" />
      <path d="M426 161l87-22m-74 50 87-22m-73 49 72-18m-122-25 18 62m25-73 18 62m24-72 18 62" stroke="#a8d4d8" strokeWidth="4" />
      <path d="M453 241l-22 52m101-76 15 50" stroke="#745943" strokeWidth="8" strokeLinecap="round" />
      <Person x={174} y={112} scale={.84} skin="#75412e" clothes="#b75e48" />
      <Person x={303} y={143} scale={.7} skin="#9a5a3b" clothes="#276f68" />
      <g className="campaign-spark">
        <path d="M559 225v-20m-9 10h18" stroke="#f7dd9a" strokeWidth="6" strokeLinecap="round" />
      </g>
      <path d="M138 284h128v14H138z" fill="#d6ab70" />
    </>
  );
}

export default function CampaignIllustration({ id, title, category }: CampaignIllustrationProps) {
  let scene;
  if (id === "BB-1") scene = <StudentScene />;
  else if (id === "BB-2") scene = <MaternityScene />;
  else if (id === "BB-3") scene = <WaterScene />;
  else if (id === "BB-4") scene = <StudentScene second />;
  else if (id === "BB-5") scene = <HospitalScene />;
  else if (id === "BB-6" || title.toLowerCase().includes("solar")) scene = <SolarScene />;
  else if (category === "Education") scene = <StudentScene />;
  else if (category === "Medical") scene = <HospitalScene />;
  else scene = <WaterScene />;

  return (
    <svg
      viewBox="0 0 800 448"
      role="img"
      aria-label={`Illustration for ${title}`}
      className="h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`campaign-bg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e6f3f3" />
          <stop offset="1" stopColor="#f8e9c7" />
        </linearGradient>
      </defs>
      <rect width="800" height="448" fill={`url(#campaign-bg-${id})`} />
      <circle cx="80" cy="88" r="33" fill="#fff" opacity=".35" />
      <circle cx="715" cy="365" r="58" fill="#fff" opacity=".3" />
      {scene}
      <style>{`
        .campaign-float { transform-box: fill-box; transform-origin: center; animation: campaign-float 3.2s ease-in-out infinite; }
        .campaign-pulse { transform-box: fill-box; transform-origin: center; animation: campaign-pulse 1.8s ease-in-out infinite; }
        .campaign-drop { transform-box: fill-box; transform-origin: center; animation: campaign-drop 2s ease-in-out infinite; }
        .campaign-spark { transform-box: fill-box; transform-origin: center; animation: campaign-spark 2.3s ease-in-out infinite; }
        @keyframes campaign-float { 50% { transform: translateY(-8px); } }
        @keyframes campaign-pulse { 50% { transform: scale(1.14); opacity: .72; } }
        @keyframes campaign-drop { 50% { transform: translateY(12px); opacity: .65; } }
        @keyframes campaign-spark { 50% { transform: scale(1.18); opacity: .68; } }
        @media (prefers-reduced-motion: reduce) {
          .campaign-float, .campaign-pulse, .campaign-drop, .campaign-spark { animation: none; }
        }
      `}</style>
    </svg>
  );
}
