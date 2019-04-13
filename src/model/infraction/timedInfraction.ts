import Infaction from "./infraction";

export default class TimedInfraction extends Infaction {
    public expireTime: Date;
    public expired: boolean;
}
