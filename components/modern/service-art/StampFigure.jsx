import ServiceMechanism from './ServiceMechanism';
import art from './stamp.json';
import { stampPose } from './models.mjs';
export default function StampFigure(){return <ServiceMechanism kind="trademark" art={art} poseAt={stampPose}/>;}
