import Club from './Club';
import Entity from './Entity';
import Herbarium from './Herbarium';

export default class User extends Entity {
  public firstName: string;
  public lastName: string;
  public username: string;
  public passwordHash: string;
  public club?: Club;
  public herbariums?: Array<Herbarium>;
}
