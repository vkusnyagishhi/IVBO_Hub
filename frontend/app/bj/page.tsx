'use client';
import { TgLoginButton } from "@/components/Common";
import { useSelector } from "@/redux/hooks";
import { VStack, Text, Button, Input, useToast, HStack } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

interface IGame {
    players: string[];
    table: string[][];
}

enum Events {
    JOIN = 'JOIN',
    ADD = 'ADD',
    PASS = 'PASS',
    DOUBLE = 'DOUBLE',
    RESET = 'RESET'
}

const baseURL = 'wss://ws.twodev.cc/bj?username=';

export default function BJ() {
    const toast = useToast();
    const { user } = useSelector(state => state.auth);
    const ws = useRef<WebSocket>(new WebSocket(baseURL));
    const [game, setGame] = useState<IGame | null>(null);

    const [ready, setReady] = useState(false);
    const [bet, setBet] = useState('');
    const [timer, setTimer] = useState(10);

    useEffect(() => {
        function connect() {
            if (!user) return;
            ws.current = new WebSocket(baseURL + user.tg_username);

            ws.current.onopen = () => {
                setReady(true);
            }

            ws.current.onmessage = (e: any) => {
                const data = JSON.parse(e.data);
                console.log(data);

                if (data.type === 'game') setGame(data.msg);
                else if (data.type === 'timer') setTimer(data.msg);
                else if (data.type === 'error') toast({ status: 'error', title: 'Ошибка', description: data.msg });
            }

            ws.current.onclose = () => {
                setReady(false);
                setTimeout(connect, 1000);
            }
        }

        connect();

        return () => { ws.current.close() };
    }, [user, ws, toast]);

    function send(event: Events, data: any = {}) {
        ws.current.send(JSON.stringify({ event, ...data }));
    }

    return user && ws.current
        ? <VStack color='white'>
            {ready ? <Text color='green'>ready</Text> : <Text color='red'>not ready</Text>}

            {game
                ? <VStack>
                    {game.table.map((cards: string[], i: number) => <HStack key={i}>
                        {game.players[i]} - {JSON.stringify(cards)}
                    </HStack>)}
                </VStack>
                : <VStack>
                    <Text>{timer}</Text>
                    <Input placeholder='bet' value={bet} onChange={(e: any) => setBet(e.target.value)} />
                    <Button onClick={() => send(Events.JOIN, { bet })} colorScheme='teal'>join</Button>
                    <Button onClick={() => send(Events.RESET)} colorScheme='red'>reset</Button>
                </VStack>}
        </VStack>
        : <VStack spacing='10px' color='white'>
            <Text>Войди, чтобы загрузить файлы</Text>
            <TgLoginButton />
        </VStack>
}