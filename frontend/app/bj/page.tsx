'use client';
import { TgLoginButton } from "@/components/Common";
import { useSelector } from "@/redux/hooks";
import { VStack, Text, Button, Input, useToast, HStack } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Centrifuge } from 'centrifuge';
import axios from "axios";

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

const baseURL = 'wss://ws.twodev.cc/centrifugo/connection/websocket';
async function getToken() {
    const { data } = await axios.get('https://api.twodev.cc/ivbo/hw/centrifugo_token', { headers: { 'x-access-token': localStorage.getItem('ivbo_token') } });
    return data.token;
}
const channel = 'ivbo_bj';

export default function BJ() {
    const toast = useToast();
    const { user } = useSelector(state => state.auth);
    const ws = useRef<Centrifuge>(new Centrifuge(baseURL));
    const [game, setGame] = useState<IGame | null>(null);

    const [ready, setReady] = useState(false);
    const [bet, setBet] = useState('');
    const [timer, setTimer] = useState(10);

    const connect = useCallback(() => {
        ws.current = new Centrifuge(baseURL, { getToken });

        ws.current.on('connected', () => console.log("cent ws connected"));

        ws.current.on('disconnected', (ctx: any) => console.log("cent ws disconnected", ctx));

        const sub = ws.current.newSubscription(channel);
        sub.on('publication', (ctx) => {
            console.log(ctx.data);
        });
        sub.subscribe();

        ws.current.connect();
    }, []);

    useEffect(() => {
        connect();
    }, [ws, connect]);

    function send(event: Events, data: any = {}) {
        ws.current.publish(channel, { event, ...data });
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