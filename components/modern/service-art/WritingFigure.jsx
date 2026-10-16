import ServiceMechanism from './ServiceMechanism';
import art from './writing.json';
import { writingPose } from './models.mjs';
export default function WritingFigure(){return <ServiceMechanism kind="copyright" art={art} poseAt={writingPose}/>;}
