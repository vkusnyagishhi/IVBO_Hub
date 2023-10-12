import TelegramLoginButton, { TelegramUser } from "telegram-login-button";
import api from "@/api";
import { toasts } from "@/misc";
import { setAuthData } from "@/redux/authSlice";
import { useToast } from "@chakra-ui/react";
import { useDispatch } from "@/redux/hooks";

export function TgLoginButton() {
    const toast = useToast();
    const dispatch = useDispatch();

    return <TelegramLoginButton
        botName={process.env.NODE_ENV === 'development' ? 'twodev_helper_bot' : 'ivbo1123bot'}
        cornerRadius={20}
        usePic={true}
        dataOnauth={(data: TelegramUser) => {
            api.post('/login', data).then(res => {
                if (res.data === 500) {
                    if (!toast.isActive('error-toast')) toast(toasts.error('Вы не состоите в группе ИВБО-11-23!'));
                } else {
                    dispatch(setAuthData(res.data));
                    localStorage.setItem('hash', data.hash);
                }
            });
        }}
    />
}