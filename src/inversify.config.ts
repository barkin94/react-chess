import { BindingScopeEnum, Container } from "inversify";
import "reflect-metadata";
import { DataStore } from "./domain/data-store";
import { BoardInitializer } from "./domain/entities/board/board-initializer.class";
import { Board } from "./domain/entities/board/board.class";
import { PieceFactory } from "./domain/entities/piece/piece-factory.class";
import { InitMatch } from "./domain/use-cases/init-match";

var container = new Container({ autoBindInjectable: true, defaultScope: BindingScopeEnum.Singleton });
// container.bind(DataStore).toSelf().inSingletonScope();
// container.bind(Board).toSelf().inSingletonScope();
// container.bind(BoardInitializer).toSelf().inSingletonScope();
// container.bind(PieceFactory).toSelf().inSingletonScope();
// container.bind(InitMatch).toSelf();

// console.log(container.get(InitMatch));
export default container;
