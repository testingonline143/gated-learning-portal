import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Upload, Edit, Plus } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string | null;
  level: string;
  duration: string;
  features: string[];
  instructor: string;
  students: number;
  videoUrl: string | null;
  pdfUrl: string | null;
}

export default function Admin() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    level: 'Beginner',
    duration: '',
    instructor: '',
    features: [''],
  });

  useEffect(() => {
    if (!user) {
      setLocation('/auth');
      return;
    }
    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      fetchCourses();
    }
  }, [isAdmin]);

  const checkAdminStatus = async () => {
    try {
      const response = await fetch('/api/admin/check', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error('Failed to check admin status');
      }
      
      setIsAdmin(data.isAdmin);
    } catch (error) {
      console.error('Admin check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const becomeAdmin = async () => {
    try {
      const response = await fetch('/api/admin/create', {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to create admin');
      }

      setIsAdmin(true);
      toast({
        title: "Success",
        description: "Admin access granted!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to grant admin access",
        variant: "destructive",
      });
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      if (!response.ok) throw new Error('Failed to fetch courses');
      
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (file: File, type: 'video' | 'pdf' | 'image') => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      toast({
        title: "Success",
        description: `${type} uploaded successfully!`,
      });
      
      return data.url;
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to upload ${type}`,
        variant: "destructive",
      });
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const courseData = {
      title: formData.title,
      description: formData.description,
      price: parseInt(formData.price) * 100, // Convert to cents
      level: formData.level,
      duration: formData.duration,
      instructor: formData.instructor,
      features: formData.features.filter(f => f.trim() !== ''),
      imageUrl: null,
      videoUrl: null,
      pdfUrl: null,
    };

    try {
      const url = editingCourse 
        ? `/api/admin/courses/${editingCourse.id}`
        : '/api/admin/courses';
      
      const method = editingCourse ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to save course');

      toast({
        title: "Success",
        description: `Course ${editingCourse ? 'updated' : 'created'} successfully!`,
      });

      resetForm();
      fetchCourses();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingCourse ? 'update' : 'create'} course`,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      price: (course.price / 100).toString(),
      level: course.level,
      duration: course.duration,
      instructor: course.instructor,
      features: course.features.length > 0 ? course.features : [''],
    });
    setIsCreating(true);
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to delete course');

      toast({
        title: "Success",
        description: "Course deleted successfully!",
      });

      fetchCourses();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      level: 'Beginner',
      duration: '',
      instructor: '',
      features: [''],
    });
    setEditingCourse(null);
    setIsCreating(false);
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? value : f)
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Admin Access Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              You need admin privileges to access this dashboard.
            </p>
            <Button onClick={becomeAdmin} className="w-full">
              Grant Admin Access
            </Button>
            <Button variant="outline" onClick={() => setLocation('/')} className="w-full">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <Button variant="outline" onClick={() => setLocation('/')}>
              Back to Site
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="upload">Upload Files</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Course Management</h2>
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Course
              </Button>
            </div>

            {isCreating && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingCourse ? 'Edit Course' : 'Create New Course'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="instructor">Instructor</Label>
                        <Input
                          id="instructor"
                          value={formData.instructor}
                          onChange={(e) => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="price">Price (USD)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="duration">Duration</Label>
                        <Input
                          id="duration"
                          value={formData.duration}
                          onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                          placeholder="e.g., 4 hours"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="level">Level</Label>
                        <Select value={formData.level} onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        required
                      />
                    </div>

                    <div>
                      <Label>Features</Label>
                      {formData.features.map((feature, index) => (
                        <div key={index} className="flex gap-2 mt-2">
                          <Input
                            value={feature}
                            onChange={(e) => updateFeature(index, e.target.value)}
                            placeholder="Enter feature"
                          />
                          {formData.features.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeFeature(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addFeature}
                        className="mt-2"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Feature
                      </Button>
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit">
                        {editingCourse ? 'Update' : 'Create'} Course
                      </Button>
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Instructor:</span> {course.instructor}</p>
                      <p><span className="font-medium">Price:</span> ${(course.price / 100).toFixed(2)}</p>
                      <p><span className="font-medium">Level:</span> {course.level}</p>
                      <p><span className="font-medium">Duration:</span> {course.duration}</p>
                      <p><span className="font-medium">Students:</span> {course.students}</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" onClick={() => handleEdit(course)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(course.id)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <h2 className="text-3xl font-bold">File Upload</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Video</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'video');
                      }}
                    />
                    <p className="text-sm text-muted-foreground">
                      Supported formats: MP4, MOV, AVI
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upload PDF</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'pdf');
                      }}
                    />
                    <p className="text-sm text-muted-foreground">
                      Supported formats: PDF, DOC, DOCX
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upload Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'image');
                      }}
                    />
                    <p className="text-sm text-muted-foreground">
                      Supported formats: JPG, PNG, GIF
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}