import ProtectedRoute from "../../../../componenents/protectedRoute"

export default function AddProjectPage() {
  return (
    <ProtectedRoute>
      <h1 className="text-4xl text-center mt-4">Ajouter un nouveau projet</h1>

    </ProtectedRoute>
  )
}