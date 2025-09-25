import PageWrapper from '@/components/ui/page-wrapper'
import LogoutButton from '@/app/(protected)/profile/_components/LogoutButton'

export default function Page() {
	return (
		<PageWrapper className="p-10">
			<LogoutButton />
		</PageWrapper>
	)
}
