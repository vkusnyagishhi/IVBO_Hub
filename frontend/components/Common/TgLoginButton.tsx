import TelegramLoginButton, { TelegramUser } from "telegram-login-button";
import { toasts } from "@/utils/misc";
import { setAuthData } from "@/redux/authSlice";
import { useToast } from "@chakra-ui/react";
import { useDispatch } from "@/redux/hooks";
import axios from "axios";
import { api } from "@/utils/api";
import { useRouter } from "next/navigation";

export function TgLoginButton() {
    const toast = useToast();
    const dispatch = useDispatch();
    const router = useRouter();

    return <TelegramLoginButton
        botName={process.env.NODE_ENV === 'development' ? 'twodev_helper_bot' : 'ivbo1123bot'}
        cornerRadius={20}
        usePic={true}
        // dataAuthUrl='http://127.0.0.1/test'
        dataOnauth={(data: TelegramUser) => {
            if (data.id === 0) return;
            localStorage.setItem('tg_userpic', data.photo_url);

            // api.post('/auth/login/telegram/generate-token', data)
            //     .then((res: any) => api.post('/auth/login/access-token', `username=${encodeURIComponent(res.data.username)}&password=${encodeURIComponent(res.data.short_token)}`, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            //         .then(res => {
            //             localStorage.setItem('ivbo_token', res.data.access_token);
            //             router.refresh();
            //         })
            //         .catch(res => console.log(res.response.data.detail)))
            //     .catch(err => {
            //         if (!toast.isActive('error-toast')) toast(toasts.error(err.response.data.detail[0].msg));
            //     });

            axios.post('https://api.twodev.cc/ivbo/login', data).then(res => {
                if (res.data === 500) {
                    if (!toast.isActive('error-toast')) toast(toasts.error('Вы не состоите в группе ИВБО-11-23!'));
                } else {
                    dispatch(setAuthData(res.data));
                    localStorage.setItem('ivbo_token', data.hash);
                }
            });
        }}
    />
}
