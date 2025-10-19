"use client"

import { useState, useTransition } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { UsersHeader, UsersSearch, UsersTable, DeleteUserDialog } from "."
import { deleteUser } from "@/lib/actions/users"

type User = {
  id: number
  username: string
  phoneNumber: string
  email: string
  role: string
  createdAt: string
}

interface UsersClientProps {
  initialUsers: User[]
  dictionary: any
  totalUsers: number
}

export function UsersClient({ initialUsers, dictionary, totalUsers }: UsersClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const [deleteId, setDeleteId] = useState<User["id"] | null>(null)
  const [deleting, setDeleting] = useState(false)

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set('search', value)
    } else {
      params.delete('search')
    }
    params.set('page', '1') // Reset to first page on search
    
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setDeleting(true)
    try {
      const result = await deleteUser(deleteId)
      if (result.success) {
        setDeleteId(null)
        router.refresh() // Refresh server component data
      }
    } catch (error) {
      console.error("Failed to delete user:", error)
    } finally {
      setDeleting(false)
    }
  }

  const currentSearch = searchParams.get('search') || ''

  return (
    <>
      <div className="space-y-6">
        <UsersHeader />
        <UsersSearch 
          search={currentSearch} 
          onSearchChange={handleSearch} 
        />
        <UsersTable 
          users={initialUsers} 
          loading={isPending} 
          onDeleteClick={setDeleteId} 
        />
      </div>

      <DeleteUserDialog 
        open={!!deleteId} 
        onOpenChange={() => setDeleteId(null)} 
        onConfirm={handleDelete} 
        deleting={deleting} 
      />
    </>
  )
}
