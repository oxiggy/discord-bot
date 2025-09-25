import PageWrapper from '@/components/ui/page-wrapper'
import UsersTable from '@/app/(protected)/dashboard/_components/users-table'

export default function Page() {
	return (
		<PageWrapper>
			<UsersTable />
		</PageWrapper>
	)
}
