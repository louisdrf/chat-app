import React, { useState } from 'react';
import { Layout } from 'antd';
import { ConversationComponent } from '../components/ConversationComponent';
import { InputMessageComponent } from '../components/InputMessageComponent';
import { Navbar } from '../components/Navbar';
import { createPrivateRoom } from '../services/roomsServices';

const { Header, Content } = Layout;

export const Home = () => {
    const [activeRoom, setActiveRoom] = useState(null);

    const onConversationClick = async (username) => {
        try {
            const room = await createPrivateRoom(username);
            setActiveRoom(room);
        } catch (error) {
            console.error("Erreur lors de la création ou la récupération de la room privée :", error);
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
                <Navbar onConversationClick={onConversationClick} />
            <Layout style={{ flex: 1 }}>
                <Header style={{ padding: 0, backgroundColor: '#fff' }}>
                    <h1 style={{ margin: 0, padding: '0 24px' }}>Home page</h1>
                </Header>
                <Content style={{ padding: '24px', backgroundColor: '#fff', minHeight: 'calc(100vh - 64px)' }}>
                    {activeRoom ? (
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <ConversationComponent room={activeRoom} />
                                <InputMessageComponent room={activeRoom} />
                            </div>
                        </div>
                    ) : (
                        <div>Veuillez sélectionner une conversation.</div>
                    )}
                </Content>
            </Layout>
        </Layout>
    );
};
