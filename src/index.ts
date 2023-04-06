import * as express from "express"
import { AppDataSource } from "./data-source"
import * as cors from "cors";
import helmet from "helmet";
import routes from './routes'
const PORT = process.env.PORT || 3000;

AppDataSource.initialize().then(async () => {
    const corsOptions = {
        origin: 'http://localhost:3000',
        methods: 'GET,POST',
        headers: 'Content-Type,Authorization'
      };
    // create express app
    const app = express()
    //midleware
    app.use(cors(corsOptions));
    app.use(helmet());

    app.use(express.json());
    //routes
    app.use('/', routes);


    // start express server
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))

}).catch(error => console.log(error))
