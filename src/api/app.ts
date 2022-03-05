import bodyParser from "body-parser";
import compression from "compression";
import express from "express";
import lusca from "lusca";
import { InMemoryEventBus } from "../contexts/core/InMemoryEventBus";

// Controllers (route handlers)
import * as healthController from "./controllers/health";
import { registerGenialyRouter } from "./genially/genially.router";
import { registerSubscribersGeniallysCounter } from "./geniallyCounter/subcribersDomainEvents";

// Create EventBus in memory
const eventBus = new InMemoryEventBus();
// Register Subscribers in applications
registerSubscribersGeniallysCounter(eventBus);

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

// Primary app routes
app.get("/", healthController.check);

//routes of Genially
app.use("/api", registerGenialyRouter(eventBus));

export default app;
