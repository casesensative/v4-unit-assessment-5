select title, content, img, profile_pic as author_pic, username as author from helo_posts p 
join helo_users u on u.user_id = p.author_id
where p.post_id = $1;