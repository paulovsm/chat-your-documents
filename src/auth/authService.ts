import { Console } from 'console';
import { supabase } from '../infra/supabaseClient';
import { tokenService } from './tokenService';
import { UserSession } from './session';
import { JwtPayload } from 'jsonwebtoken';

export const authService = {
    async login({ username } : { username: string }) {
        const { data, error } = await supabase
            .from('whitelisted_emails')
            .select('id')
            .eq('email', username)
            .is('enabled', true);

        if (error || !data || data.length === 0)
            throw new Error('Invalid or Unauthorized user!');

        await tokenService.save(data[0].id);
    },
    async getSession(ctx = null): Promise<UserSession> {
        const token = tokenService.get(ctx);
        const decodedToken: JwtPayload = await tokenService.decodeToken(token) as JwtPayload;

        if (!decodedToken) {
            throw new Error('Invalid or Unauthorized user!');
        }

        const { data, error } = await supabase
            .from('whitelisted_emails')
            .select('*')
            .eq('id', decodedToken!.sub)
            .is('enabled', true);


        if (error || !data || data.length === 0)
            throw new Error('Invalid or Unauthorized user!');

        return {
            data: {
                user: {
                    username: data[0].username,
                    email: data[0].email,
                    fullname: data[0].fullname,
                },
                id: String(decodedToken!.sub),
                roles: decodedToken!.roles,
            }
        };

    }
};