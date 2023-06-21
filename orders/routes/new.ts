import mongoose from 'mongoose';
import express , {Request,Response} from 'express'
import { requireAuth,validateRequest} from '@artickit/common';
import {body} from 'express-validator'

const router = express.Router();

router.post('/api/orders',requireAuth,[
    body('tickerId')
    .not()
    .isEmpty()
    .custom((input: string)=>mongoose.Types.ObjectId.isValid(input))
    .withMessage('Ticket Id must be provided')
    

],validateRequest,async(req:Request,res:Response)=>{

    res.send({});
})

export {router as newOrderRouter};