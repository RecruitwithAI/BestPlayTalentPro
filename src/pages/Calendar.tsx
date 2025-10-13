import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState<"challenge" | "training" | "live_jam">("challenge");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Fetch events
  const { data: events = [] } = useQuery({
    queryKey: ["calendar-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("calendar_events")
        .select("*")
        .order("start_time", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  // Create event mutation
  const createEvent = useMutation({
    mutationFn: async (eventData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("calendar_events").insert({
        ...eventData,
        created_by: user.id,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar-events"] });
      toast({
        title: "Event created",
        description: "Your event has been scheduled successfully.",
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setEventType("challenge");
    setStartTime("");
    setEndTime("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive",
      });
      return;
    }

    const startDateTime = new Date(selectedDate);
    const [startHour, startMinute] = startTime.split(":");
    startDateTime.setHours(parseInt(startHour), parseInt(startMinute));

    const endDateTime = new Date(selectedDate);
    const [endHour, endMinute] = endTime.split(":");
    endDateTime.setHours(parseInt(endHour), parseInt(endMinute));

    createEvent.mutate({
      title,
      description,
      event_type: eventType,
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
    });
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case "challenge":
        return "Challenge";
      case "training":
        return "Training";
      case "live_jam":
        return "Live Jam";
      default:
        return type;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "challenge":
        return "bg-red-500";
      case "training":
        return "bg-blue-500";
      case "live_jam":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const selectedDateEvents = events.filter((event) => {
    const eventDate = new Date(event.start_time);
    return selectedDate && format(eventDate, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
  });

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Event Calendar</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Schedule New Event</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="eventType">Event Type</Label>
                  <Select value={eventType} onValueChange={(value: any) => setEventType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="challenge">Challenge</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="live_jam">Live Jam Session</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={createEvent.isPending}>
                  {createEvent.isPending ? "Scheduling..." : "Schedule Event"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Select Date
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border pointer-events-auto"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateEvents.length === 0 ? (
                <p className="text-muted-foreground text-sm">No events scheduled for this day.</p>
              ) : (
                <div className="space-y-3">
                  {selectedDateEvents.map((event) => (
                    <div key={event.id} className="border rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <div className={`w-2 h-2 rounded-full mt-2 ${getEventTypeColor(event.event_type)}`} />
                        <div className="flex-1">
                          <h4 className="font-semibold">{event.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {getEventTypeLabel(event.event_type)}
                          </p>
                          {event.description && (
                            <p className="text-sm mt-1">{event.description}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(event.start_time), "h:mm a")} - {format(new Date(event.end_time), "h:mm a")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>All Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <p className="text-muted-foreground text-sm">No events scheduled yet.</p>
            ) : (
              <div className="space-y-2">
                {events.filter(e => new Date(e.start_time) >= new Date()).map((event) => (
                  <div key={event.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.event_type)}`} />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{event.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {getEventTypeLabel(event.event_type)}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(event.start_time), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Calendar;
