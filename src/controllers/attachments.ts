import {Request, Response} from 'express';
import fs from 'fs';

import {AttachmentsCollection, IAttachment, AttachmentsClientCollection} from '../models/attachments';
import {ClientsCollection, IClient} from '../models/clients';
import {IInvoice, InvoicesCollection} from '../models/invoices';
import {IEmailAttachment} from '../models/common';

interface IFile {
  name: string;
  type: string;
  lastModifiedDate: string;
  path: string;
}

export const getAttachment = async (req: Request, res: Response) => {
  const {
    id, model, type, fileName,
  } = req.params;

  let attachment: IAttachment | null;
  if (model === 'client') {
    attachment = await AttachmentsClientCollection.findById({_id: id});
  } else {
    attachment = await AttachmentsCollection.findById({_id: id});
  }

  const attachmentBuffer: Buffer = attachment![type];

  let responseType: string = '';
  if (!req.query.download) {
    const ext = fileName.substr(fileName.lastIndexOf('.') + 1);

    const determineResponseType = (): string => {
      if (type === 'pdf' || ext === 'pdf') {
        return 'application/pdf';
      } if (['png', 'bmp', 'jpg', 'gif'].includes(ext)) {
        return `image/${ext}`;
      } if (['html', 'htm'].includes(ext)) {
        return 'text/html';
      } if (['ppt'].includes(ext)) {
        return 'application/vnd.ms-powerpoint';
      } if (['pptx'].includes(ext)) {
        return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      } if (['txt'].includes(ext)) {
        return 'text/plain';
      } if (['xls'].includes(ext)) {
        return 'application/vnd.ms-excel';
      } if (['xlsx', 'xlsm'].includes(ext)) {
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      } if (['csv'].includes(ext)) {
        return 'text/csv';
      } if (['doc'].includes(ext)) {
        return 'application/msword';
      } if (['docx'].includes(ext)) {
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      } if (['odp'].includes(ext)) {
        return 'application/vnd.oasis.opendocument.presentation';
      } if (['ods'].includes(ext)) {
        return 'application/vnd.oasis.opendocument.spreadsheet';
      } if (['odt'].includes(ext)) {
        return 'application/vnd.oasis.opendocument.text';
      }
      return '';
    };

    responseType = determineResponseType();
  }

  // Download the file
  if (!fileName) {
    // eslint-disable-next-line no-console
    console.log('Downloading a file without knowing the filename', req.params);
  }

  return res.type(responseType).set('Content-Disposition', `inline;filename=${fileName}`).send(attachmentBuffer);
};

export const addAttachment = async (req: Request, res: Response) => {
  const {id, model, type} = req.params;
  const [file] = req.files as Express.Multer.File[];

  const fileBuffer = file.buffer;
  let result: IClient | IInvoice | null = null;

  if (model === 'invoice') {
    result = await InvoicesCollection.findById({_id: id}, 'attachments');
    const {_id, attachments} = result!;
    attachments.push({
      type,
      fileName: file.originalname,
      fileType: file.mimetype,
      lastModifiedDate: new Date().toISOString(),
    });

    await InvoicesCollection.findByIdAndUpdate({_id}, {attachments});
    await AttachmentsCollection.findByIdAndUpdate({_id}, {$set: {[type]: fileBuffer}}, {upsert: true});
  }

  if (model === 'client') {
    result = await ClientsCollection.findById({_id: id}, 'attachments');
    const {_id, attachments} = result!;
    attachments.push({
      type,
      fileName: file.originalname,
      fileType: file.mimetype,
      lastModifiedDate: new Date().toISOString(),
    });
    await ClientsCollection.findByIdAndUpdate({_id}, {attachments});
    await AttachmentsClientCollection.findByIdAndUpdate({_id}, {$set: {[type]: fileBuffer}}, {upsert: true});
  }

  return res.send(result);
};
