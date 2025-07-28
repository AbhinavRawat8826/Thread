import Post from '../models/postModel.js'
import User from '../models/userModel.js'
import { v2 as cloudinary } from "cloudinary";

const createPost = async (req, res) => {
	try {
		const { text } = req.body;
		let { img } = req.body;

		if (!text) {
			return res.status(400).json({ error: "Text field is required" });
		}

		const maxLength = 500;
		if (text.length > maxLength) {
			return res.status(400).json({ error: `Text must be less than ${maxLength} characters` });
		}

		
		const postedBy = req.user._id;

		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

		const newPost = new Post({ postedBy, text, img });
		await newPost.save();

		res.status(201).json(newPost);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err.message });
	}
};



const getPost = async (req,res)=>{
    try {

        const {id} = req.params

        const post = await Post.findById(id)

        if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		res.status(200).json(post);

    } catch (error) {
		
        res.status(500).json({ error: err.message });
		
    }
}

const deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		if (post.postedBy.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Unauthorized to delete post" });
		}

		if (post.img) {
			const imgId = post.img.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(imgId);
		}

		await Post.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};


const likeUnlikePost = async (req, res) => {
	try {
	  const { id: postId } = req.params; 
	  const userId = req.user._id;
	  
	  const post = await Post.findById(postId);
	  if (!post) {
		return res.status(404).json({ error: "Post not found" });
	  }
  
	  
	  const userLikedPost = post.likes.includes(userId); 
  
	  if (userLikedPost) {
		
		await Post.updateOne(
		  { _id: postId },
		  { $pull: { likes: userId } }
		);
		return res.status(200).json({ message: 'Post unliked successfully' });
	  } else {
		
		post.likes.push(userId);
		await post.save();  
		return res.status(200).json({ message: 'Post liked successfully' });
	  }
	} catch (error) {
	  console.error(error); 
	  return res.status(500).json({ error: error.message });
	}
  };

 const replyToPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;
    const userProfilePic = req.user.profilePic;
    const username = req.user.username;

    if (!text) {
      return res.status(400).json({ error: "Text field is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const reply = { userId, text, userProfilePic, username };
    post.replies.push(reply);
    await post.save();

    const updatedPost = await Post.findById(postId);
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getFeedPosts = async (req, res) => {
	try {
	  const userId = req.user._id; 
	  const user = await User.findById(userId);
  
	  if (!user) return res.status(404).json({ error: "User not found" });
  
	  
	  const feedPosts = await Post.aggregate([
		{
			$match: {
			 
			  postedBy: { $ne: userId } 
			}
		  },
		  {
			$sample: { size: 20 } 
		  },
		  {
			$limit: 10 
		  }
	  ]);
	  
  
	  if (!feedPosts.length) {
		return res.status(404).json({ error: "No posts found" });
	  }
  
	  res.status(200).json(feedPosts); 
	} catch (error) {
	  console.error(error);
	  return res.status(500).json({ error: error.message });
	}
  };
  
  

const getUserPosts = async (req, res) => {
	const { username } = req.params;
	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });

		res.status(200).json(posts);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
  

export {createPost,getPost,deletePost,likeUnlikePost,replyToPost,getFeedPosts,getUserPosts}

