import {Router} from 'express';
import multer from 'multer';

import {getAttachment, addAttachment} from '../controllers/attachments';

const multiPartFormMiddleware = multer();
const attachmentsRouter = Router();

attachmentsRouter.get('/:model/:id/:type/:fileName', getAttachment);
attachmentsRouter.put('/:model/:id/:type', multiPartFormMiddleware.any(), addAttachment);

export default attachmentsRouter;
