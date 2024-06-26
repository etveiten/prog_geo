import { useRef } from "react";
import { ReactComponent as BufferIcon } from "../Icons/buffer_1.svg";
import { ReactComponent as UnionIcon } from "../Icons/union_svg.svg";
import { ReactComponent as IntersectIcon } from "../Icons/intersect_svg.svg";
import { ReactComponent as DifferenceIcon } from "../Icons/difference_svg.svg";
import { ReactComponent as DissolveIcon } from "../Icons/dissolve_svg.svg";
import { ReactComponent as ClipIcon } from "../Icons/clip_svg.svg";
import { ReactComponent as DataIcon } from "../Icons/data_svg.svg";
import { ReactComponent as InfoIcon } from "../Icons/info_svg.svg";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

function Dock({ onIconClick }) {
  let mouseX = useMotionValue(Infinity);

  const icons = [
    "buffer",
    "union",
    "intersect",
    "difference",
    "dissolve",
    "clip",
    "data",
  ];


  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="dock-icons-container"
    >
      {icons.map((icon, i) => (
        <AppIcon mouseX={mouseX} key={i} iconType={icon} onClick={() => onIconClick(icon)} />
      ))}
    </motion.div>
  );
}


function AppIcon({ mouseX, iconType, onClick }) {
  let ref = useRef(null);

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  let scale = useTransform(distance, [-150, 0, 150], [1, 1.5, 1]);
  let scaleSpring = useSpring(scale, { mass: 0.1, stiffness: 150, damping: 12 });

  const renderIcon = () => {
    switch (iconType) {
      case "buffer":
        return <BufferIcon />;
      case "union":
        return <UnionIcon />;
      case "intersect":
        return <IntersectIcon />;
      case "difference":
        return <DifferenceIcon />;
      case "dissolve":
        return <DissolveIcon />
      case "clip":
        return <ClipIcon/>
      case "data":
        return <DataIcon/>
      case "info":
        return <InfoIcon/>
      default:
        return null; // or some default icon
    }
  };

  return (
    <div ref={ref} className="app-icon-container" onClick={onClick}>
      <motion.div style={{ scale: scaleSpring }} className="app-icon">
        {renderIcon()}
      </motion.div>
    </div>
  );
}


export default Dock;
