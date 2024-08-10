import React, { useState } from 'react';
import { Layout } from 'antd';
import { ConversationComponent } from '../components/rooms/ConversationComponent';
import { Navbar } from '../components/Navbar';
import { createRoom } from '../services/roomsServices';
import { CurrentConversationHeader } from '../components/rooms/roomHeader/CurrentConversationHeader';
import { InputMessageComponent } from '../components/rooms/InputMessageComponent';
import { PublicRoomsNavbar } from '../components/PublicRoomsNavbar';
import { useRooms } from '../contexts/roomsContext';

const { Header, Content } = Layout;

export const Home = () => {

    const { activeRoom } = useRooms()

    return (
            <Layout style={{ minHeight: '100vh' }}>
                    <PublicRoomsNavbar />
                        <Layout style={{ minHeight: '100vh' }}>
                            <Navbar />
                                <Layout style={{ flex: 1 }}>
                                    <Header style={{ padding: 0, backgroundColor: '#fff' }}>
                                        {activeRoom && (
                                            <div>
                                                <CurrentConversationHeader />
                                            </div>
                                        )}
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
            </Layout>
    )
}
