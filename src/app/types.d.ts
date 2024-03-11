import { NextRequest as OriginalNextRequest } from 'next/server'
import { User } from './api/users/User'

declare global {
    declare interface NextRequest extends OriginalNextRequest {
        user?: HydratedDocument<User>
    }
}