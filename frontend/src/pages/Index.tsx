import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
/* import { useLanguage } from "@/contexts/LanguageContext"; */

// Stubs contents for demonstration purposes -> we need to plug the public API to fetch user posts
const posts = [
  {
    id: 1,
    author: "Alex Chen",
    username: "@alexc",
    content: "Just shipped a new feature! The team worked incredibly hard on this. Can't wait to see what you all think!",
    likes: 42,
    comments: 8,
    time: "2h",
  },
  {
    id: 2,
    author: "Sarah Miller",
    username: "@sarahm",
    content: "Beautiful sunset from the office today. Sometimes you need to stop and appreciate the little things.",
    likes: 128,
    comments: 23,
    time: "4h",
  },
  {
    id: 3,
    author: "Jordan Lee",
    username: "@jordanl",
    content: "Reading through some great discussions on AI ethics. The future is going to be interesting. What are your thoughts?",
    likes: 67,
    comments: 31,
    time: "6h",
  },
];

export const Index = () => {
  const { t } = useLanguage();
  
  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* <h1 className="text-2xl font-bold animate-fade-in">{t("page.home")}</h1> */}
        
        {posts.map((post, index) => (
          <Card 
            key={post.id} 
            className="animate-fade-in card-hover"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="pt-4">
              <div className="flex gap-3">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="bg-secondary">
                    {post.author.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">{post.author}</span>
                    <span className="text-muted-foreground text-sm">{post.username}</span>
                    <span className="text-muted-foreground text-sm">• {post.time}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto rounded-full">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <p className="mt-2 text-foreground leading-relaxed">{post.content}</p>
                  
                  <div className="flex items-center gap-6 mt-4">
                    <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
                      <Heart className="h-4 w-4" />
                      <span>{post.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comments}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Layout>
  );
};
