import React from 'react'
import { EmergencyContact } from '@/types/database'

interface EmergencyContactsProps {
  contacts: EmergencyContact[]
}

export function EmergencyContacts({ contacts }: EmergencyContactsProps) {
  if (contacts.length === 0) {
    return <p>비상 연락처가 없습니다.</p>
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">비상 연락처</h3>
      <ul className="space-y-1">
        {contacts.map((contact, idx) => (
          <li key={idx} className="border rounded p-2">
            <p><strong>{contact.role}</strong>: {contact.name}</p>
            <p>전화번호: {contact.phone}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
