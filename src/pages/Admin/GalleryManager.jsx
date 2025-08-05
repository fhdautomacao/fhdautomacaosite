import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  Image, 
  Edit, 
  Trash2, 
  Plus, 
  X, 
  Save,
  Eye,
  Filter,
  Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { storageAPI } from '@/api/storage'
import { galleryAPI } from '@/api/gallery'
import { categoriesAPI } from '@/api/categories'

const GalleryManager = () => {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoriesAPI.getByType("gallery")
        setCategories(data)
      } catch (err) {
        console.error("Erro ao carregar categorias da galeria:", err)
      }
    }
    loadCategories()
  }, [])

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const [newPhoto, setNewPhoto] = useState({
    title: "",