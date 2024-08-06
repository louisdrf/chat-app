import React, { useState, useEffect, useRef } from 'react';
import { Input, Dropdown, Menu } from 'antd';
import Highlighter from 'react-highlight-words';
import { HeaderSearchFoundMessage } from './HeaderSearchFoundMessage';

export const SearchMessage = ({ messages }) => {
  const [searchText, setSearchText] = useState('')
  const [foundMessages, setFoundMessages] = useState([])
  const [visible, setVisible] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (searchText) {
      const filtered = messages.filter((msg) =>
        msg.content.toLowerCase().includes(searchText.toLowerCase())
      );
      setFoundMessages(filtered)
      setVisible(true)
    } else {
      setFoundMessages([])
      setVisible(false)
    }
  }, [searchText, messages])

  const handleSearch = (e) => {
    setSearchText(e.target.value)
  }

  const renderMenuItems = () => (
    <Menu>
      {foundMessages.length > 0 ? (
        foundMessages.map((msg, index) => (
          <Menu.Item key={index}>
            <HeaderSearchFoundMessage
              user={msg.sentBy}
              message={{
                ...msg,
                content: (
                  <Highlighter
                    highlightClassName="search-highlight"
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={msg.content}
                  />
                ),
              }}
            />
          </Menu.Item>
        ))
      ) : (
        <Menu.Item>Aucun message trouvé</Menu.Item>
      )}
    </Menu>
  )

  return (
    <div>
      <Dropdown
        overlay={renderMenuItems()}
        trigger={['click']}
        visible={visible}
        onOpenChange={(flag) => setVisible(flag)}
      >
        <Input
          placeholder="Chercher un message..."
          onChange={handleSearch}
          value={searchText}
          ref={inputRef}
        />
      </Dropdown>
    </div>
  )
}
