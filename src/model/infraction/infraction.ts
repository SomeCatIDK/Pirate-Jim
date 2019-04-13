import InfractionType from "./infractionType";

export default class Infaction {
    public infractionId: number;
    public userId: string;
    public reason: string;
    public time: Date;
    public modId: string;
    public infractionType: InfractionType;
    public revoked: boolean;
    public revokedModId: string;
}
