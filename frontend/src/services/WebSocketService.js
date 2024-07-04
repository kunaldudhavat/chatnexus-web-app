import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const api_url = process.env.REACT_APP_API_URL;

class WebSocketService {
    constructor() {
        this.stompClient = null;
        this.subscriptions = {};
    }

    connect(onConnected) {
        const socket = new SockJS(`${api_url}/ws`);
        this.stompClient = Stomp.over(socket);

        this.stompClient.connect({}, () => {
            console.log('WebSocket Connected');
            if (onConnected) onConnected();
        }, this.onError);
    }

    subscribe(topic, callback) {
        if (this.stompClient && this.stompClient.connected) {
            if (!this.subscriptions[topic]) {
                const subscription = this.stompClient.subscribe(topic, (message) => {
                    const receivedMessage = JSON.parse(message.body);
                    callback(receivedMessage);
                });
                this.subscriptions[topic] = subscription;
            }
        } else {
            console.error('STOMP client is not connected');
        }
    }

    unsubscribe(topic) {
        if (this.subscriptions[topic]) {
            this.subscriptions[topic].unsubscribe();
            delete this.subscriptions[topic];
        }
    }

    sendMessage(destination, message) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send(destination, {}, JSON.stringify(message));
        } else {
            console.error('STOMP client is not connected');
        }
    }

    disconnect() {
        if (this.stompClient) {
            Object.values(this.subscriptions).forEach(subscription => subscription.unsubscribe());
            this.subscriptions = {};
            this.stompClient.disconnect();
        }
    }

    onError(error) {
        console.error('WebSocket Error:', error);
    }
}
const instance = new WebSocketService()

export default instance;