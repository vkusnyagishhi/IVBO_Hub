import TelegramLoginButton, { TelegramUser } from "telegram-login-button";
import { toasts } from "@/utils/misc";
import { setAuthData } from "@/redux/authSlice";
import { useToast } from "@chakra-ui/react";
import { useDispatch } from "@/redux/hooks";
import axios from "axios";

export function TgLoginButton() {
    const toast = useToast();
    const dispatch = useDispatch();

    return <TelegramLoginButton
        botName={process.env.NODE_ENV === 'development' ? 'twodev_helper_bot' : 'ivbo1123bot'}
        cornerRadius={20}
        usePic={true}
        // dataAuthUrl='http://127.0.0.1/test'
        dataOnauth={(data: TelegramUser) => {
            axios.post('https://api.twodev.cc/ivbo/login', data).then(res => {
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
