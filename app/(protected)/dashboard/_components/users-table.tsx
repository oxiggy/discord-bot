export default function UsersTable() {
	return (
		<div className="">
			<div className="pb-10 w-full flex gap-2">
				<p>tabs: </p>
				<p>Users</p>
				<p>Banned users (1+)</p>
				<p className="ml-auto">- refresh -</p>
			</div>

			<p className="inline-flex gap-10">
				<span>nickname</span>
				<span>discord id + copy</span>
				<span>roles</span>
				<span>balls + change</span>
				<span>ban</span>
			</p>
		</div>
	)
}
