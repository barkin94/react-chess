import { BindingScopeEnum, Container } from "inversify";
import "reflect-metadata";

var container = new Container({ autoBindInjectable: true, defaultScope: BindingScopeEnum.Singleton });

export default container;
